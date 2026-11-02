import 'server-only';
import { z } from 'zod';
import { required } from './env';
import { providerJson,ProviderError } from './http';
import { dateInZone,type FollowerSnapshot } from '../domain';

export function parseInstagramSnapshot(payload:unknown,expectedId:string,observedAt=new Date().toISOString()):FollowerSnapshot {
  const row=z.object({id:z.string(),username:z.string().min(1).max(100),followers_count:z.number().int().nonnegative().max(Number.MAX_SAFE_INTEGER)}).parse(payload);
  if(row.id!==expectedId) throw new ProviderError('INSTAGRAM_ACCOUNT_MISMATCH');
  return {accountId:row.id,username:row.username,date:dateInZone(observedAt),followers:row.followers_count,observedAt};
}
export async function fetchInstagram(deadline:number) {
  const account=z.string().regex(/^\d+$/).parse(required('INSTAGRAM_ACCOUNT_ID'));
  const version=z.string().regex(/^v\d+\.0$/).parse(required('INSTAGRAM_GRAPH_VERSION'));
  // Instagram professional account via the Facebook Graph API; use a separate authorized integration token.
  const url=new URL(`https://graph.facebook.com/${version}/${account}`);url.searchParams.set('fields','id,username,followers_count');
  const snapshot=parseInstagramSnapshot(await providerJson(url,{headers:{Authorization:`Bearer ${required('INSTAGRAM_ACCESS_TOKEN')}`}},deadline),account);
  const expected=process.env.INSTAGRAM_USERNAME?.replace(/^@/,'').toLowerCase();
  if(expected&&snapshot.username.toLowerCase()!==expected) throw new ProviderError('INSTAGRAM_ACCOUNT_MISMATCH');
  return snapshot;
}
