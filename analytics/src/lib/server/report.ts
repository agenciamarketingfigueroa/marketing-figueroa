import 'server-only';
import { z } from 'zod';
import type { requireAccess } from './auth';
import { type Dataset, type OrderStatus, daysBetween, shiftDay } from '../domain';
import { MAX_REPORT_DAYS } from '../operation';

export const periodSchema = z.object({start:z.iso.date(),end:z.iso.date()}).refine(f => daysBetween(f.start,f.end)>0 && daysBetween(f.start,f.end)<=MAX_REPORT_DAYS,'Período acima do limite permitido');
const integer = (v: unknown) => z.coerce.number().int().nonnegative().max(Number.MAX_SAFE_INTEGER).parse(v);
const optionalNumber = (v: unknown) => v == null ? null : z.coerce.number().finite().nonnegative().max(Number.MAX_SAFE_INTEGER).parse(v);
type Access = Awaited<ReturnType<typeof requireAccess>>;

export async function loadReport(access:Access,start:string,end:string): Promise<Dataset> {
  periodSchema.parse({start,end});
  const {db,organizationId} = access;
  const from = shiftDay(start,-daysBetween(start,end));
  // Initial reporting timezone is explicitly fixed to São Paulo (UTC-03 for supported dates).
  const begin = `${from}T00:00:00-03:00`; const until = `${shiftDay(end,1)}T00:00:00-03:00`;
  async function rows(table:string,sort:string) {
    const all = [];
    for(let offset=0;offset<20000;offset+=1000) {
      let query = db.from(table).select('*').eq('organization_id',organizationId).order(sort);
      if(table==='ad_insights') query=query.gte('date',from).lte('date',end).order('account_id').order('ad_id');
      if(table==='hotmart_orders') query=query.or(`and(approved_at.gte.${begin},approved_at.lt.${until}),and(approved_at.is.null,purchased_at.gte.${begin},purchased_at.lt.${until})`).order('account_id');
      const {data,error}=await query.range(offset,offset+999);
      if(error) throw new Error('REPORT_UNAVAILABLE');
      all.push(...data);
      if(data.length<1000) return all;
    }
    throw new Error('REPORT_LIMIT_REDUCE_PERIOD');
  }
  const [organization,accounts,products,orders,insights,campaigns,adsets,ads,mappings,sync,lastWebhook,creatives,igAccounts,igSnapshots] = await Promise.all([
    db.from('organizations').select('name').eq('id',organizationId).single(),rows('ad_accounts','id'),rows('products','id'),rows('hotmart_orders','transaction'),
    rows('ad_insights','date'),rows('campaigns','id'),rows('adsets','id'),rows('ads','id'),rows('attribution_mapping','id'),rows('sync_jobs','provider'),
    db.from('webhook_events').select('received_at').eq('organization_id',organizationId).neq('event','RECONCILIATION').eq('result','processed').order('received_at',{ascending:false}).limit(1),
    rows('ad_creatives','ad_id'),rows('instagram_accounts','id'),rows('instagram_snapshots','date'),
  ]);
  if(organization.error || lastWebhook.error) throw new Error('REPORT_UNAVAILABLE');
  const key=(account:string,id:string)=>`${account}:${id}`;
  const campaignMap=new Map(campaigns.map(r=>[key(r.account_id,r.id),r]));
  const adsetMap=new Map(adsets.map(r=>[key(r.account_id,r.id),r]));
  const adMap=new Map(ads.map(r=>[key(r.account_id,r.id),r]));
  const productMap=new Map(products.map(r=>[key(r.account_id,r.id),r.name]));
  return {organizationId,organization:organization.data.name,mode:'live',accounts:accounts.map(r=>({id:r.id,name:r.name})),
    creatives:creatives.map(r=>({accountId:r.account_id,adId:r.ad_id,creativeId:r.creative_id,name:r.name,imageUrl:r.image_url,videoId:r.video_id,kind:r.kind})),
    followers:igSnapshots.map(r=>({accountId:r.account_id,username:igAccounts.find(a=>a.id===r.account_id)?.username??r.account_id,date:r.date,followers:integer(r.followers),observedAt:r.observed_at})),
    coverage:Object.fromEntries((['meta','hotmart'] as const).map(provider=>{
      const jobs=sync.filter(j=>j.provider===provider);
      // Initial deployment has one account per provider. Multiple jobs require an explicit coverage intersection.
      return [provider,jobs.length===1 ? z.array(z.object({start:z.number(),end:z.number()})).parse(jobs[0].cursor.coverage??[]) : []];
    })) as Dataset['coverage'],
    orders:orders.map(r=>({transaction:r.transaction,accountId:r.account_id,productId:r.product_id,product:productMap.get(key(r.account_id,r.product_id)) ?? r.product_id,
      offer:r.offer,status:r.status as OrderStatus,purchasedAt:r.purchased_at,approvedAt:r.approved_at,currency:r.currency,gross:integer(r.gross),net:optionalNumber(r.net),
      payment:r.payment,source:z.record(z.string(),z.string()).parse(r.source),parentTransaction:r.parent_transaction,isBump:r.is_bump,isFunnel:r.is_funnel})),
    insights:insights.map(r=>{const ad=adMap.get(key(r.account_id,r.ad_id));if(!ad) throw new Error('INCOMPLETE_REPORT');return {
      date:r.date,accountId:r.account_id,campaignId:ad.campaign_id,campaign:campaignMap.get(key(r.account_id,ad.campaign_id))?.name ?? ad.campaign_id,
      adsetId:ad.adset_id,adset:adsetMap.get(key(r.account_id,ad.adset_id))?.name ?? ad.adset_id,adId:r.ad_id,ad:ad.name,status:ad.status,currency:r.currency,
      spend:integer(r.spend),impressions:integer(r.impressions),clicks:optionalNumber(r.clicks),views:optionalNumber(r.views),checkouts:optionalNumber(r.checkouts),purchases:optionalNumber(r.purchases),purchaseValue:optionalNumber(r.purchase_value),reach:optionalNumber(r.reach),
    };}),mappings:mappings.map(r=>({sourceKey:r.source_key,sourceValue:r.source_value,hotmartAccountId:r.hotmart_account_id,productId:r.product_id,offer:r.offer,accountId:r.account_id,campaignId:r.campaign_id,adsetId:r.adset_id,adId:r.ad_id})),
    sync:(['meta','hotmart','instagram'] as const).map(provider=>{
      const jobs=sync.filter(j=>j.provider===provider);const lastSuccess=jobs.length && jobs.every(j=>j.last_success) ? jobs.map(j=>j.last_success).sort()[0] : null;
      return {provider,status:jobs.some(j=>j.status==='error') ? 'error' : jobs.some(j=>j.status==='running') ? 'running' : jobs.length && jobs.every(j=>j.status==='success') ? 'success' : 'pending',lastSuccess,lastEvent:provider==='hotmart' ? lastWebhook.data[0]?.received_at ?? null : null,message:jobs.some(j=>j.last_error) ? 'Falha de sincronização. Consulte os registros do servidor.' : null};
    }),
  };
}
