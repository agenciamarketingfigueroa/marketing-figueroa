export type OrderStatus = 'APPROVED' | 'COMPLETE' | 'CANCELLED' | 'REFUNDED' | 'CHARGEBACK' | 'PARTIALLY_REFUNDED' | 'WAITING_PAYMENT' | 'PRINTED_BILLET' | 'EXPIRED' | 'OVERDUE' | 'PROTESTED' | 'BLOCKED' | 'NO_FUNDS' | 'PRE_ORDER' | 'PROCESSING_TRANSACTION' | 'STARTED' | 'UNDER_ANALISYS' | 'DISPUTE';
export interface Order {
  transaction: string; accountId: string; productId: string; product: string; offer: string | null;
  status: OrderStatus; purchasedAt: string; approvedAt: string | null; currency: string;
  gross: number; net: number | null; payment: string; source: Record<string, string>;
  parentTransaction: string | null; isBump: boolean; isFunnel: boolean;
  manualSourcePresent?: boolean;
  manualSourceCategory?: string; manualTool?: string;
}
export interface Insight {
  date: string; accountId: string; campaignId: string; campaign: string; adsetId: string;
  adset: string; adId: string; ad: string; status: string; currency: string;
  spend: number; impressions: number; clicks: number | null; views: number | null;
  checkouts: number | null; purchases: number | null; purchaseValue: number | null;
  reach: number | null;
  periodEnd?: string;
  instagramFollows?: number; exportAdId?: string; idPrecision?: 'rounded'|'exact';
}
export interface Attribution {
  sourceKey: string; sourceValue: string; hotmartAccountId: string; productId: string; offer: string | null;
  accountId: string; campaignId: string; adsetId: string; adId: string;
}
export interface SyncState {
  provider: 'meta' | 'hotmart' | 'instagram'; status: 'pending' | 'running' | 'success' | 'error';
  lastSuccess: string | null; lastEvent?: string | null; message: string | null;
}
export interface Dataset {
  organizationId: string; organization: string; mode: 'demo' | 'live' | 'manual';
  accounts: { id: string; name: string }[]; orders: Order[]; insights: Insight[];
  mappings: Attribution[]; sync: SyncState[];
  coverage?: { meta: import('./coverage').CoverageWindow[]; hotmart: import('./coverage').CoverageWindow[] };
  creatives?: Creative[];
  followers?: FollowerSnapshot[];
  manualStatusComplete?: boolean;
  instagramDaily?: {date:string;views:number;interactions:number;followers:number}[];
  instagramFollowersKind?: 'new';
  instagramSources?: {name:string;rows:number;sha256:string}[];
  manualMetaIdPrecision?: 'rounded'|'exact';
  instagramAudience?: {age:{label:string;men:number;women:number}[];cities:{label:string;value:number}[];countries:{label:string;value:number}[]};
  manualPeriods?: {start:string;end:string;month:string;sources:{name:string;rows:number}[]}[];
}
export interface Creative { accountId:string;adId:string;creativeId:string;name:string;imageUrl:string|null;videoId:string|null;kind:string;sourcePath?:string;matchBasis?:string }
export interface FollowerSnapshot { accountId:string;username:string;date:string;followers:number;observedAt:string }
export interface Filters { start: string; end: string; currency: string; account: string; product: string }

export const approved = (s: OrderStatus) => s === 'APPROVED' || s === 'COMPLETE';
export const pending = (s: OrderStatus) => ['WAITING_PAYMENT', 'PRINTED_BILLET', 'OVERDUE', 'PRE_ORDER', 'PROCESSING_TRANSACTION', 'STARTED', 'UNDER_ANALISYS'].includes(s);
export const divide = (a: number | null, b: number | null) => a !== null && b !== null && b !== 0 ? a / b : null;
export function sumMinor(values:number[]) {
  let sum=0;
  for(const value of values) {if(!Number.isSafeInteger(value)||!Number.isSafeInteger(sum+value)) throw new Error('MONEY_OVERFLOW');sum+=value;}
  return sum;
}
export function fractionDigits(currency: string) {
  return new Intl.NumberFormat('en', { style: 'currency', currency }).resolvedOptions().maximumFractionDigits ?? 2;
}
/** Decimal parsing avoids floating point arithmetic in financial sums. */
export function minorUnits(value: string | number, currency: string): number {
  const digits = fractionDigits(currency);
  const text = String(value);
  if (!/^\d+(\.\d+)?$/.test(text)) throw new Error('INVALID_MONEY');
  const [whole, fraction = ''] = text.split('.');
  if (fraction.slice(digits).replace(/0/g, '')) throw new Error('MONEY_PRECISION');
  const result = BigInt(whole) * 10n ** BigInt(digits) + BigInt((fraction.slice(0, digits).padEnd(digits, '0')) || '0');
  if (result > BigInt(Number.MAX_SAFE_INTEGER)) throw new Error('MONEY_OVERFLOW');
  return Number(result);
}
export function money(value: number | null, currency = 'BRL') {
  return value === null ? '—' : new Intl.NumberFormat('pt-BR', { style: 'currency', currency, maximumFractionDigits: fractionDigits(currency) }).format(value / 10 ** fractionDigits(currency));
}
export function dateInZone(iso: string, timeZone = 'America/Sao_Paulo') {
  return new Intl.DateTimeFormat('en-CA', { timeZone, year: 'numeric', month: '2-digit', day: '2-digit' }).format(new Date(iso));
}
export const orderDay = (o: Order) => dateInZone(o.approvedAt || o.purchasedAt);
export function daysBetween(start: string, end: string) {
  return Math.round((Date.parse(end + 'T00:00:00Z') - Date.parse(start + 'T00:00:00Z')) / 86400000) + 1;
}
export function shiftDay(day: string, amount: number) {
  return new Date(Date.parse(day + 'T00:00:00Z') + amount * 86400000).toISOString().slice(0, 10);
}
export function previousPeriod(f: Filters): Filters {
  const length = daysBetween(f.start, f.end);
  return { ...f, start: shiftDay(f.start, -length), end: shiftDay(f.start, -1) };
}
export function variation(current: number | null, previous: number | null) {
  return current === null || previous === null || previous === 0 ? null : (current - previous) / Math.abs(previous) * 100;
}
export function attribute(order: Order, mappings: Attribution[]): Attribution | null {
  const matches = mappings.filter(m => m.hotmartAccountId === order.accountId && m.productId === order.productId && (!m.offer || m.offer === order.offer) && order.source[m.sourceKey] === m.sourceValue);
  const targets = new Set(matches.map(m => [m.accountId, m.campaignId, m.adsetId, m.adId].join(':')));
  return targets.size === 1 ? matches[0] : null;
}
function optionalSum(rows: Insight[], key: 'clicks' | 'views' | 'checkouts' | 'purchases' | 'purchaseValue') {
  return rows.length && rows.every(r => r[key] !== null) ? key==='purchaseValue' ? sumMinor(rows.map(r=>r[key]!)) : rows.reduce((sum, r) => sum + r[key]!, 0) : null;
}
export function select(data: Dataset, f: Filters) {
  const inPeriod = (day: string) => day >= f.start && day <= f.end;
  const orders = data.orders.filter(o => o.currency === f.currency && inPeriod(orderDay(o)) && (f.product === 'all' || o.productId === f.product) && (f.account === 'all' || attribute(o, data.mappings)?.accountId === f.account));
  const insights = data.insights.filter(r => r.currency === f.currency && inPeriod(r.date) && (!r.periodEnd || inPeriod(r.periodEnd)) && (f.account === 'all' || r.accountId === f.account) && (f.product === 'all' || data.mappings.some(m => m.productId === f.product && m.adId === r.adId && m.accountId === r.accountId)));
  return { orders, insights };
}
export function summarize(orders: Order[], insights: Insight[], mappings: Attribution[]) {
  const sales = orders.filter(o => approved(o.status));
  const spend = insights.length ? sumMinor(insights.map(r=>r.spend)) : null;
  const gross = orders.length ? sumMinor(sales.map(o=>o.gross)) : null;
  const net = sales.length && sales.every(o => o.net !== null) ? sumMinor(sales.map(o=>o.net!)) : null;
  const impressions = insights.length ? insights.reduce((s, r) => s + r.impressions, 0) : null;
  const clicks = optionalSum(insights, 'clicks');
  const purchases = optionalSum(insights, 'purchases');
  const views=optionalSum(insights,'views');const checkouts=optionalSum(insights,'checkouts');
  const attributed = sales.filter(o => attribute(o, mappings));
  // Reach cannot be summed across dates or ads: people may overlap.
  const reach = insights.length === 1 ? insights[0].reach : null;
  return { spend, gross, net, profit: net !== null && spend !== null ? net - spend : null,
    sales: orders.length ? sales.length : null, ticket: divide(gross, sales.length),
    mer: divide(gross, spend), cpa: divide(spend, purchases), cpc: divide(spend, clicks),
    ctr: divide(clicks === null ? null : clicks * 100, impressions),
    cpm: divide(spend === null ? null : spend * 1000, impressions), frequency: divide(impressions, reach),
    metaRoas: divide(optionalSum(insights, 'purchaseValue'), spend),
    attributedRoas: divide(orders.length ? sumMinor(attributed.map(o=>o.gross)) : null, spend),
    attributed: attributed.length, unattributed: sales.length - attributed.length,
    trackingRate:divide(attributed.length*100,orders.length?sales.length:null),
    costPerView:divide(spend,views),connectRate:divide(views===null?null:views*100,clicks),
    costPerCheckout:divide(spend,checkouts),pvToCheckout:divide(checkouts===null?null:checkouts*100,views),
    pvToPurchase:divide(purchases===null?null:purchases*100,views),
    pending: orders.filter(o => pending(o.status)).length as number|null,
    refunds: orders.filter(o => ['REFUNDED', 'CHARGEBACK', 'PARTIALLY_REFUNDED'].includes(o.status)).length as number|null,
    impressions, clicks, views, checkouts, purchases,
  };
}
