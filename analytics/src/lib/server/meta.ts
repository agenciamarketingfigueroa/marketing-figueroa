import 'server-only';
import { z } from 'zod';
import { type Insight, minorUnits } from '../domain';
import { required } from './env';
import { providerJson, ProviderError } from './http';
import { safeCreativeUrl } from '../media';

const number = z.coerce.number().finite().nonnegative();
const actions = z.array(z.object({action_type:z.string(),value:z.string()}));
const rowSchema = z.object({date_start:z.iso.date(),account_id:z.string(),account_currency:z.string().regex(/^[A-Z]{3}$/),
  campaign_id:z.string(),campaign_name:z.string(),adset_id:z.string(),adset_name:z.string(),ad_id:z.string(),ad_name:z.string(),
  spend:z.string(),impressions:number,reach:number.optional(),inline_link_clicks:number.optional(),actions:actions.optional(),action_values:actions.optional()});
type Action = z.infer<typeof actions>;
export function actionValue(list: Action | undefined, type: string) {
  if (!list) return null;
  const item = list.find(a => a.action_type === type);
  return item ? number.parse(item.value) : 0;
}
export function parseInsight(raw: unknown): Insight {
  const r = rowSchema.parse(raw);
  const purchase = r.action_values?.find(a => a.action_type === 'purchase');
  return {date:r.date_start,accountId:r.account_id,campaignId:r.campaign_id,campaign:r.campaign_name,
    adsetId:r.adset_id,adset:r.adset_name,adId:r.ad_id,ad:r.ad_name,status:'UNKNOWN',currency:r.account_currency,
    spend:minorUnits(r.spend,r.account_currency),impressions:r.impressions,reach:r.reach ?? null,clicks:r.inline_link_clicks ?? null,
    views:actionValue(r.actions,'landing_page_view'),checkouts:actionValue(r.actions,'initiate_checkout'),
    purchases:actionValue(r.actions,'purchase'),purchaseValue:r.action_values ? purchase ? minorUnits(purchase.value,r.account_currency) : 0 : null};
}
const pageSchema = z.object({data:z.array(z.unknown()),paging:z.object({next:z.string().optional(),cursors:z.object({after:z.string().optional()}).optional()}).optional()});
export async function metaPages(path: string, params: Record<string,string>, deadline: number) {
  const version = z.string().regex(/^v\d+\.0$/).parse(required('META_GRAPH_VERSION'));
  const base = new URL(`https://graph.facebook.com/${version}/${path}`);
  const all: unknown[] = []; const cursors = new Set<string>(); let after: string | undefined;
  for (let page = 0; page < 100; page++) {
    const url = new URL(base); url.search = new URLSearchParams({...params,limit:'200',...(after ? {after} : {})}).toString();
    const result = pageSchema.parse(await providerJson(url,{headers:{Authorization:`Bearer ${required('META_ACCESS_TOKEN')}`}},deadline));
    all.push(...result.data);
    if (!result.paging?.next) return all;
    after = result.paging.cursors?.after;
    // Never follow a provider's arbitrary next URL with our token.
    if (!after || cursors.has(after)) throw new ProviderError('PAGINATION_INVALID');
    cursors.add(after);
  }
  throw new ProviderError('PAGINATION_LIMIT');
}
const entity = z.object({id:z.string(),effective_status:z.string(),daily_budget:z.string().optional(),lifetime_budget:z.string().optional()});
const adMeta = z.object({id:z.string(),effective_status:z.string(),campaign:entity,adset:entity,creative:z.object({id:z.string(),image_url:z.string().nullish(),thumbnail_url:z.string().nullish(),video_id:z.string().nullish(),object_type:z.string().nullish()}).optional()});
export async function fetchMeta(account: string, start: string, end: string, deadline: number) {
  if (!/^\d+$/.test(account)) throw new ProviderError('INVALID_ACCOUNT');
  const version=z.string().regex(/^v\d+\.0$/).parse(required('META_GRAPH_VERSION'));
  const accountUrl=new URL(`https://graph.facebook.com/${version}/act_${account}`);
  accountUrl.searchParams.set('fields','account_id,currency,timezone_name');
  const metadataAccount=z.object({account_id:z.string(),currency:z.string(),timezone_name:z.string()}).parse(await providerJson(accountUrl,{headers:{Authorization:`Bearer ${required('META_ACCESS_TOKEN')}`}},deadline));
  if(metadataAccount.account_id!==account || metadataAccount.timezone_name!=='America/Sao_Paulo') throw new ProviderError('ACCOUNT_TIMEZONE_MISMATCH');
  const raw = await metaPages(`act_${account}/insights`,{
    fields:'date_start,account_id,account_currency,campaign_id,campaign_name,adset_id,adset_name,ad_id,ad_name,spend,impressions,reach,inline_link_clicks,actions,action_values',
    level:'ad',time_increment:'1',time_range:JSON.stringify({since:start,until:end}),use_unified_attribution_setting:'true',action_report_time:'conversion',
  },deadline);
  const metadata = new Map((await metaPages(`act_${account}/ads`,{fields:'id,effective_status,creative{id,image_url,thumbnail_url,video_id,object_type},campaign{id,effective_status,daily_budget,lifetime_budget},adset{id,effective_status,daily_budget,lifetime_budget}'},deadline)).map(r => {const a = adMeta.parse(r); return [a.id,a];}));
  return raw.map(r => {
    const insight = parseInsight(r); const ad = metadata.get(insight.adId);
    if (insight.accountId !== account) throw new ProviderError('INVALID_ACCOUNT');
    if (insight.currency !== metadataAccount.currency) throw new ProviderError('ACCOUNT_CURRENCY_MISMATCH');
    // Budgets are already returned in currency minor units by Meta.
    const budget = (v: string | undefined) => v === undefined ? null : z.coerce.number().int().nonnegative().max(Number.MAX_SAFE_INTEGER).parse(v);
    return {...insight,status:ad?.effective_status ?? 'UNKNOWN',campaignStatus:ad?.campaign.effective_status ?? 'UNKNOWN',adsetStatus:ad?.adset.effective_status ?? 'UNKNOWN',
      creativeId:ad?.creative?.id??null,creativeImage:safeCreativeUrl(ad?.creative?.image_url)??safeCreativeUrl(ad?.creative?.thumbnail_url),creativeVideo:ad?.creative?.video_id??null,creativeKind:ad?.creative?.object_type??'UNKNOWN',
      campaignDailyBudget:budget(ad?.campaign.daily_budget),campaignLifetimeBudget:budget(ad?.campaign.lifetime_budget),
      adsetDailyBudget:budget(ad?.adset.daily_budget),adsetLifetimeBudget:budget(ad?.adset.lifetime_budget)};
  });
}
