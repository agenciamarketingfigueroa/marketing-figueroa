import 'server-only';
import { createHash } from 'node:crypto';
import { z } from 'zod';
import { dateInZone,shiftDay } from '../domain';
import { workerDb } from './supabase';
import { required } from './env';
import { fetchMeta } from './meta';
import { hotmartPage,hotmartToken,parseHistory,operationCommission,statuses } from './hotmart';
import { errorCode,ProviderError } from './http';
import { mergeCoverage } from '../coverage';
import { nextMetaWindow } from '../meta-window';
import { OPERATION_START } from '../operation';
import { fetchInstagram } from './instagram';
import { hotmartProductScope } from './product-scope';

const windowsSchema=z.array(z.object({start:z.number(),end:z.number()}));
const cursorSchema=z.object({start:z.number(),end:z.number(),status:z.number().int().nonnegative().max(16),page:z.string().optional(),phase:z.enum(['recent','history']),historyDay:z.iso.date(),cycleStarted:z.string(),coverage:windowsSchema.default([])});
export async function syncProvider(provider:'meta'|'hotmart'|'instagram') {
  const db=workerDb();const org=z.uuid().parse(required('SYNC_ORGANIZATION_ID'));
  const account=required(provider==='meta'?'META_AD_ACCOUNT_ID':provider==='instagram'?'INSTAGRAM_ACCOUNT_ID':'HOTMART_ACCOUNT_ID');
  const claimed=await db.rpc('claim_sync',{p_org:org,p_provider:provider,p_account:account});
  if(claimed.error) throw new ProviderError('CLAIM_FAILED');
  if(!claimed.data) return {status:'already_running'};
  const lease=claimed.data as string;const deadline=Date.now()+145000;let cursor:unknown=null;
  try {
    if(provider==='instagram') {
      const snapshot=await fetchInstagram(deadline);
      const result=await db.rpc('commit_instagram_snapshot',{p_org:org,p_account:account,p_lease:lease,p_snapshot:snapshot});
      if(result.error) throw new ProviderError('PERSIST_FAILED');
    } else if(provider==='meta') {
      const previous=await db.from('sync_jobs').select('cursor').eq('organization_id',org).eq('provider',provider).eq('account_id',account).single();
      if(previous.error) throw new ProviderError('CURSOR_UNAVAILABLE');
      const state=z.object({phase:z.enum(['recent','history']).optional(),historyNext:z.iso.date().optional(),coverage:windowsSchema.default([])}).parse(previous.data.cursor);
      const beginning=z.iso.date().parse(process.env.META_HISTORY_START||OPERATION_START);
      const today=dateInZone(new Date().toISOString());if(beginning>today) throw new ProviderError('INVALID_HISTORY_START');
      const {start,end,next}=nextMetaWindow(today,state,beginning);
      const rows=await fetchMeta(account,start,end,deadline);
      const result=await db.rpc('commit_meta_snapshot',{p_org:org,p_account:account,p_lease:lease,p_start:start,p_end:end,p_rows:rows});
      if(result.error) throw new ProviderError('PERSIST_FAILED');
      const creatives=[...new Map(rows.map(row=>[row.adId,row])).values()];
      const media=await db.rpc('commit_ad_creatives',{p_org:org,p_account:account,p_lease:lease,p_rows:creatives});
      if(media.error) throw new ProviderError('CREATIVES_PERSIST_FAILED');
      cursor={...next,coverage:mergeCoverage(state.coverage,{start:Date.parse(`${start}T00:00:00-03:00`),end:Date.parse(`${end}T23:59:59.999-03:00`)})};
    } else {
      const allowedProducts=hotmartProductScope();
      const historyStart=z.iso.date().parse(process.env.HOTMART_HISTORY_START||OPERATION_START);
      const now=Date.now();if(Date.parse(historyStart)>now) throw new ProviderError('INVALID_HISTORY_START');
      const job=await db.from('sync_jobs').select('cursor').eq('organization_id',org).eq('provider',provider).eq('account_id',account).single();
      if(job.error) throw new ProviderError('CURSOR_UNAVAILABLE');
      const saved=cursorSchema.safeParse(job.data.cursor);
      const state=saved.success ? saved.data : {start:Math.max(Date.parse(historyStart),now-7*86400000),end:now,status:0,phase:'recent' as const,historyDay:historyStart,cycleStarted:new Date().toISOString(),coverage:[]};
      const token=await hotmartToken(deadline);
      const historyStatuses=statuses.filter(s=>s!=='DISPUTE');
      // Bound work per invocation; continuation is durable. Webhooks remain the fast path.
      for(let batch=0;batch<20 && Date.now()<deadline-25000;batch++) {
        const observedAt=new Date().toISOString();
        const page=await hotmartPage(token,state.start,state.end,historyStatuses[state.status],state.page,deadline);
        for(const raw of page.items) {
          const order=parseHistory(raw,account);
          if(!allowedProducts.has(order.productId)) continue;
          order.net=await operationCommission(token,order,deadline);
          const digest=createHash('sha256').update(JSON.stringify(order)).digest('hex');
          const event={id:`api:${state.cycleStarted}:${order.transaction}:${digest}`,event:'RECONCILIATION',digest,occurredAt:observedAt,observedAt,lease,order};
          const applied=await db.rpc('apply_hotmart_event',{p_org:org,p_account:account,p_event:event});
          if(applied.error) throw new ProviderError('PERSIST_FAILED');
        }
        const next=page.page_info.next_page_token;
        if(next && next===state.page) throw new ProviderError('PAGINATION_INVALID');
        state.page=next;
        if(!next) state.status++;
        if(state.status>=historyStatuses.length) {
          state.coverage=mergeCoverage(state.coverage,{start:state.start,end:state.end});
          state.status=0;state.cycleStarted=new Date().toISOString();
          if(state.phase==='recent') {
            state.phase='history';state.start=Date.parse(state.historyDay+'T00:00:00Z');state.end=Math.min(state.start+86400000-1,Date.now());
          } else {
            state.historyDay=shiftDay(state.historyDay,1);
            if(Date.parse(state.historyDay)>=Date.now()-7*86400000) state.historyDay=historyStart;
            state.phase='recent';state.end=Date.now();state.start=Math.max(Date.parse(historyStart),state.end-7*86400000);
          }
        }
        // Save cursor only after a whole page is committed; retries are idempotent.
        const savedPage=await db.from('sync_jobs').update({cursor:state}).eq('organization_id',org).eq('provider',provider).eq('account_id',account).eq('lease_id',lease).gt('lease_until',new Date().toISOString()).select('lease_id');
        if(savedPage.error || !savedPage.data?.length) throw new ProviderError('LEASE_EXPIRED');
        cursor={...state};
      }
      if(cursor===null) throw new ProviderError('SYNC_TIME_BUDGET');
    }
    const finished=await db.rpc('finish_sync',{p_org:org,p_provider:provider,p_account:account,p_lease:lease,p_code:null,p_cursor:cursor});
    if(finished.error) throw new ProviderError('LEASE_EXPIRED');
    return {status:'success'};
  } catch(error) {
    const code=errorCode(error);
    await db.rpc('finish_sync',{p_org:org,p_provider:provider,p_account:account,p_lease:lease,p_code:code,p_cursor:null});
    throw new ProviderError(code);
  }
}
