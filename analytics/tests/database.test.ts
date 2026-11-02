import { beforeAll,afterAll,describe,it,expect } from 'vitest';
import { PGlite } from '@electric-sql/pglite';
import { readFileSync } from 'node:fs';

const org='11111111-1111-4111-8111-111111111111';const other='22222222-2222-4222-8222-222222222222';
const user='aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa';const otherUser='bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbbb';
let db:PGlite;
beforeAll(async()=>{
  db=new PGlite();
  await db.exec(`create role anon; create role authenticated; create role service_role bypassrls;
    create schema auth; create table auth.users(id uuid primary key);
    create function auth.jwt() returns jsonb language sql stable as $$ select coalesce(nullif(current_setting('request.jwt.claims',true),''),'{}')::jsonb $$;
    create function auth.uid() returns uuid language sql stable as $$ select (auth.jwt()->>'sub')::uuid $$;
    grant usage on schema public,auth to anon,authenticated,service_role;
    grant execute on function auth.jwt(),auth.uid() to anon,authenticated,service_role;`);
  await db.exec(readFileSync(new URL('../supabase/migrations/202611020001_analytics.sql',import.meta.url),'utf8'));
  await db.exec(readFileSync(new URL('../supabase/migrations/202611020002_realtime.sql',import.meta.url),'utf8'));
  await db.exec(readFileSync(new URL('../supabase/migrations/202611020003_creatives_instagram.sql',import.meta.url),'utf8'));
  await db.exec(`insert into auth.users values('${user}'),('${otherUser}');
    insert into public.organizations(id,name) values('${org}','Mvave teste'),('${other}','Outra empresa');
    insert into public.organization_members values('${org}','${user}','admin'),('${other}','${otherUser}','viewer');
    insert into public.hotmart_accounts values('${org}','hm','Hotmart teste'),('${other}','hm','Outra conta');
    insert into public.ad_accounts values('${org}','meta','Meta teste','BRL','America/Sao_Paulo'),('${other}','meta','Outra Meta','BRL','America/Sao_Paulo');`);
},60000);
afterAll(async()=>{await db.close();});
async function asUser(id:string,aal:string,sql:string) {
  await db.exec('set role authenticated');
  await db.query("select set_config('request.jwt.claims',$1,false)",[JSON.stringify({sub:id,aal})]);
  try {return await db.query(sql);} finally {await db.exec('reset role');}
}
function event(id:string,time:string,status='APPROVED') {
  return {id,digest:`digest-${id}`,event:status==='REFUNDED'?'PURCHASE_REFUNDED':'PURCHASE_APPROVED',occurredAt:time,
    order:{transaction:'HP-1',productId:'p1',product:'Produto teste',offer:'offer',status,purchasedAt:'2026-10-01T12:00:00Z',approvedAt:'2026-10-01T12:01:00Z',currency:'BRL',gross:9700,net:null,payment:'PIX',source:{sck:'ad-1'},parentTransaction:null,isBump:false,isFunnel:false}};
}
async function apply(payload:ReturnType<typeof event>) {
  return (await db.query<{result:string}>('select public.apply_hotmart_event($1,$2,$3) result',[org,'hm',JSON.stringify(payload)])).rows[0].result;
}
describe('Migrations reais em PostgreSQL (PGlite)',()=>{
  it('ativa RLS em todas as tabelas públicas',async()=>{
    const result=await db.query("select relname from pg_class c join pg_namespace n on n.oid=c.relnamespace where n.nspname='public' and c.relkind='r' and not c.relrowsecurity");
    expect(result.rows).toHaveLength(0);
  });
  it('bloqueia admin em AAL1 e isola organizações em AAL2',async()=>{
    expect((await asUser(user,'aal1','select * from public.ad_accounts')).rows).toHaveLength(0);
    const own=(await asUser(user,'aal2','select * from public.ad_accounts')).rows;
    expect(own).toHaveLength(1);expect(own[0]).toMatchObject({organization_id:org});
    const second=(await asUser(otherUser,'aal2','select * from public.ad_accounts')).rows;
    expect(second).toHaveLength(1);expect(second[0]).toMatchObject({organization_id:other});
    expect((await asUser(user,'aal2',`select * from public.ad_accounts where organization_id='${other}'`)).rows).toHaveLength(0);
  });
  it('nega escalada de função, escrita direta e acesso a RPC privilegiada',async()=>{
    await expect(asUser(user,'aal2',`insert into public.organization_members values('${other}','${user}','admin')`)).rejects.toThrow(/permission denied/);
    await expect(asUser(user,'aal2',`select public.claim_sync('${org}','meta','meta')`)).rejects.toThrow(/permission denied/);
    await db.exec('set role anon');try {await expect(db.query('select * from public.hotmart_orders')).rejects.toThrow(/permission denied/);}finally{await db.exec('reset role');}
  });
  it('processa uma única transação para eventos duplicados',async()=>{
    const approved=event('event-approved','2026-10-01T12:01:00Z');
    expect(await apply(approved)).toBe('processed');expect(await apply(approved)).toBe('duplicate');
    expect((await db.query('select * from public.hotmart_orders')).rows).toHaveLength(1);
    await expect(apply({...approved,digest:'changed'})).rejects.toThrow('EVENT_ID_CONFLICT');
  });
  it('preserva reembolso contra evento aprovado atrasado',async()=>{
    expect(await apply(event('event-refund','2026-10-03T12:00:00Z','REFUNDED'))).toBe('processed');
    expect(await apply(event('event-late','2026-10-02T12:00:00Z'))).toBe('ignored_stale');
    expect((await db.query('select status,gross from public.hotmart_orders')).rows[0]).toMatchObject({status:'REFUNDED',gross:9700});
  });
  it('não mantém marcador de sucesso quando persistência falha',async()=>{
    const invalid=event('bad-status','2026-10-05T12:00:00Z','INVALID');
    await expect(apply(invalid)).rejects.toThrow();
    expect((await db.query("select id from public.webhook_events where id='bad-status'")).rows).toHaveLength(0);
  });
  it('impede jobs simultâneos e exige fencing token válido',async()=>{
    const lease=(await db.query<{token:string}>('select public.claim_sync($1,$2,$3) token',[org,'meta','meta'])).rows[0].token;
    expect(lease).toBeTruthy();expect((await db.query('select public.claim_sync($1,$2,$3) token',[org,'meta','meta'])).rows[0]).toMatchObject({token:null});
    await expect(db.query('select public.commit_meta_snapshot($1,$2,$3,$4,$5,$6)',[org,'meta',other,'2026-10-01','2026-10-02','[]'])).rejects.toThrow('LEASE_EXPIRED');
    await db.query('select public.finish_sync($1,$2,$3,$4,$5)',[org,'meta','meta',lease,'PROVIDER_RATE_LIMIT']);
    expect((await db.query('select status,last_success,last_error from public.sync_jobs')).rows[0]).toMatchObject({status:'error',last_success:null,last_error:'PROVIDER_RATE_LIMIT'});
  });
  it('aplica rate limit compartilhado no banco',async()=>{
    expect((await db.query("select public.take_request('test',2) ok")).rows[0]).toMatchObject({ok:true});
    await db.query("select public.take_request('test',2)");
    expect((await db.query("select public.take_request('test',2) ok")).rows[0]).toMatchObject({ok:false});
  });
  it('recusa conciliação sem lease',async()=>{
    const payload={...event('reconciliation','2026-10-07T12:00:00Z'),event:'RECONCILIATION',observedAt:'2026-10-07T12:00:00Z'};
    await expect(apply(payload)).rejects.toThrow('LEASE_EXPIRED');
  });
  it('não reabre reembolso por snapshot atrasado da API',async()=>{
    const lease=(await db.query<{token:string}>('select public.claim_sync($1,$2,$3) token',[org,'hotmart','hm'])).rows[0].token;
    const payload={...event('api-stale','2027-01-01T12:00:00Z'),event:'RECONCILIATION',observedAt:'2027-01-01T12:00:00Z',lease};
    expect(await apply(payload)).toBe('ignored_stale');
    expect((await db.query("select status from public.hotmart_orders where transaction='HP-1'")).rows[0]).toMatchObject({status:'REFUNDED'});
  });
  it('conciliação não avança relógio de eventos: reembolso tardio ainda é aplicado',async()=>{
    const job=(await db.query<{lease_id:string}>("select lease_id from public.sync_jobs where provider='hotmart'")).rows[0];
    const api={...event('api-new','2027-01-01T12:00:00Z'),event:'RECONCILIATION',observedAt:'2027-01-01T12:00:00Z',lease:job.lease_id};
    api.order.transaction='HP-2';expect(await apply(api)).toBe('processed');
    const refund=event('refund-delayed','2026-10-05T12:00:00Z','REFUNDED');refund.order.transaction='HP-2';
    expect(await apply(refund)).toBe('processed');
    expect((await db.query("select status from public.hotmart_orders where transaction='HP-2'")).rows[0]).toMatchObject({status:'REFUNDED'});
  });
  it('substitui snapshot Meta atomicamente, sem duplicar dias',async()=>{
    const lease=(await db.query<{token:string}>('select public.claim_sync($1,$2,$3) token',[org,'meta','meta'])).rows[0].token;
    const row={date:'2026-10-01',accountId:'meta',campaignId:'c1',campaign:'Campanha',adsetId:'s1',adset:'Conjunto',adId:'a1',ad:'Anúncio',status:'ACTIVE',currency:'BRL',spend:1000,impressions:100,clicks:5,views:4,checkouts:2,purchases:1,purchaseValue:9700,reach:90};
    const commit=(rows:unknown[])=>db.query('select public.commit_meta_snapshot($1,$2,$3,$4,$5,$6)',[org,'meta',lease,'2026-10-01','2026-10-01',JSON.stringify(rows)]);
    await commit([row]);await commit([{...row,spend:1200}]);
    expect((await db.query('select spend from public.ad_insights')).rows).toEqual([{spend:1200}]);
    await expect(commit([{...row,accountId:'other'}])).rejects.toThrow('INVALID_SCOPE');
    expect((await db.query('select spend from public.ad_insights')).rows).toEqual([{spend:1200}]);
  });
  it('protege previews dos criativos por organização, MFA e lease',async()=>{
    const lease=(await db.query<{lease_id:string}>("select lease_id from public.sync_jobs where provider='meta' and organization_id=$1",[org])).rows[0].lease_id;
    const row={accountId:'meta',adId:'a1',ad:'Anúncio',creativeId:'creative1',creativeImage:'https://scontent.xx.fbcdn.net/test.jpg',creativeKind:'VIDEO'};
    const commit=(payload:unknown)=>db.query('select public.commit_ad_creatives($1,$2,$3,$4)',[org,'meta',lease,JSON.stringify([payload])]);
    await commit(row);
    expect((await asUser(user,'aal2','select * from public.ad_creatives')).rows).toHaveLength(1);
    expect((await asUser(otherUser,'aal2','select * from public.ad_creatives')).rows).toHaveLength(0);
    expect((await asUser(user,'aal1','select * from public.ad_creatives')).rows).toHaveLength(0);
    await expect(commit({...row,accountId:'other'})).rejects.toThrow('INVALID_SCOPE');
    await expect(asUser(user,'aal2',`select public.commit_ad_creatives('${org}','meta','${lease}','[]')`)).rejects.toThrow(/permission denied/);
    await commit({...row,creativeId:null});expect((await db.query('select * from public.ad_creatives')).rows).toHaveLength(0);
  });
  it('registra seguidores uma vez por dia sem regredir a coleta, isolando contas',async()=>{
    const lease=(await db.query<{token:string}>('select public.claim_sync($1,$2,$3) token',[org,'instagram','ig1'])).rows[0].token;
    const row={accountId:'ig1',username:'teste',date:'2026-11-02',followers:500,observedAt:'2026-11-02T12:00:00Z'};
    const commit=(payload:unknown)=>db.query('select public.commit_instagram_snapshot($1,$2,$3,$4)',[org,'ig1',lease,JSON.stringify(payload)]);
    await commit(row);await commit({...row,followers:510,observedAt:'2026-11-02T13:00:00Z'});await commit({...row,followers:499});
    expect((await asUser(user,'aal2','select followers from public.instagram_snapshots')).rows).toEqual([{followers:510}]);
    expect((await asUser(otherUser,'aal2','select * from public.instagram_snapshots')).rows).toHaveLength(0);
    expect((await asUser(user,'aal1','select * from public.instagram_snapshots')).rows).toHaveLength(0);
    await expect(commit({...row,accountId:'ig2'})).rejects.toThrow('INVALID_SCOPE');
    await expect(commit({...row,date:'2026-11-01'})).rejects.toThrow('INVALID_SCOPE');
    await expect(asUser(user,'aal2',`update public.instagram_snapshots set followers=999`)).rejects.toThrow(/permission denied/);
    await expect(db.query('select public.commit_instagram_snapshot($1,$2,$3,$4)',[org,'ig1',other,JSON.stringify(row)])).rejects.toThrow('LEASE_EXPIRED');
    await db.query('select public.finish_sync($1,$2,$3,$4,$5)',[org,'instagram','ig1',lease,null]);
  });
});
