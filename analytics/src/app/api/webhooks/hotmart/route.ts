import { NextResponse } from 'next/server';
import { boundedJson,ProviderError,secretMatches } from '@/lib/server/http';
import { parseWebhook } from '@/lib/server/hotmart';
import { workerDb } from '@/lib/server/supabase';
import { syncScope } from '@/lib/server/env';
import { ZodError } from 'zod';
import { hotmartProductScope } from '@/lib/server/product-scope';
export const runtime='nodejs';
export async function POST(request:Request) {
  if(!process.env.HOTMART_HOTTOK) return NextResponse.json({error:'NOT_CONFIGURED'},{status:503});
  if(!secretMatches(request.headers.get('X-HOTMART-HOTTOK'),process.env.HOTMART_HOTTOK)) return NextResponse.json({error:'UNAUTHORIZED'},{status:401});
  if(!request.headers.get('content-type')?.toLowerCase().includes('application/json')) return NextResponse.json({error:'JSON_REQUIRED'},{status:415});
  try {
    const {organizationId,hotmartAccount}=syncScope(); const db=workerDb();
    const limit=await db.rpc('take_request',{p_key:`hotmart:${organizationId}:${hotmartAccount}`,p_limit:300});
    if(limit.error) throw new Error('LIMIT_UNAVAILABLE');
    if(!limit.data) return NextResponse.json({error:'RATE_LIMIT'},{status:429,headers:{'Retry-After':'60'}});
    const event=parseWebhook(await boundedJson(request),hotmartAccount);
    if(event.order&&!hotmartProductScope().has(event.order.productId)) return NextResponse.json({received:true,result:'ignored_product'});
    const result=await db.rpc('apply_hotmart_event',{p_org:organizationId,p_account:hotmartAccount,p_event:event});
    if(result.error) throw new Error('PERSIST_FAILED');
    return NextResponse.json({received:true,result:result.data});
  } catch(error) {
    const badInput=error instanceof ZodError || error instanceof SyntaxError || error instanceof ProviderError;
    return NextResponse.json({error:badInput ? 'INVALID_EVENT' : 'PROCESSING_UNAVAILABLE'},{status:error instanceof ProviderError && error.code==='BODY_TOO_LARGE' ? 413 : badInput ? 400 : 503});
  }
}
