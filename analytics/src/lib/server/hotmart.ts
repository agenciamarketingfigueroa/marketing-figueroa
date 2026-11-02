import 'server-only';
import { z } from 'zod';
import { createHash } from 'node:crypto';
import { minorUnits, type Order } from '../domain';
import { required } from './env';
import { providerJson, ProviderError } from './http';

const id = z.union([z.string().min(1).max(200), z.number().int().nonnegative().max(Number.MAX_SAFE_INTEGER)]).transform(String);
const text = z.string().max(500);
const currency = z.string().regex(/^[A-Z]{3}$/);
const value = z.union([z.number().finite().nonnegative(), z.string().regex(/^\d+(\.\d+)?$/)]);
const timestamp = z.coerce.number().int().positive().max(8640000000000000);
export const statuses = ['APPROVED','BLOCKED','CANCELLED','CHARGEBACK','COMPLETE','EXPIRED','NO_FUNDS','OVERDUE','PARTIALLY_REFUNDED','PRE_ORDER','PRINTED_BILLET','PROCESSING_TRANSACTION','PROTESTED','REFUNDED','STARTED','UNDER_ANALISYS','WAITING_PAYMENT','DISPUTE'] as const;
const purchaseBase = {
  transaction: id, status: z.enum(statuses), order_date: timestamp, approved_date: timestamp.nullish(),
  offer: z.object({ code: text.optional() }).optional(), payment: z.object({ type: text }),
};
const product = z.object({ id, name: text.min(1) });
const origin = z.object({ src: text.optional(), sck: text.optional(), xcod: text.optional() });
export const webhookEnvelope = z.object({ id, creation_date: timestamp, event: text.min(1), version: z.literal('2.0.0'), data: z.unknown() });
const webhookData = z.object({ product, purchase: z.object({
  ...purchaseBase, full_price: z.object({ value, currency_value: currency }),
  origin: origin.optional(), order_bump: z.object({ is_order_bump: z.boolean(), parent_purchase_transaction: text.optional() }).optional(),
  is_funnel: z.boolean().optional(),
}) });
const eventStatuses: Record<string, string[]> = {
  PURCHASE_APPROVED: ['APPROVED'], PURCHASE_COMPLETE: ['COMPLETE'], PURCHASE_CANCELED: ['CANCELLED'],
  PURCHASE_REFUNDED: ['REFUNDED','PARTIALLY_REFUNDED'], PURCHASE_CHARGEBACK: ['CHARGEBACK'],
  PURCHASE_BILLET_PRINTED: ['PRINTED_BILLET'], PURCHASE_EXPIRED: ['EXPIRED'],
  PURCHASE_DELAYED: ['OVERDUE','WAITING_PAYMENT'], PURCHASE_PROTEST: ['PROTESTED','DISPUTE'],
};
const iso = (ms: number) => new Date(ms).toISOString();
const compact = (source: Record<string, string | undefined>): Record<string,string> => Object.fromEntries(Object.entries(source).filter((entry): entry is [string,string] => Boolean(entry[1])));
export function parseWebhook(payload: unknown, accountId: string) {
  const envelope = webhookEnvelope.parse(payload);
  if (envelope.creation_date > Date.now() + 300000) throw new ProviderError('INVALID_EVENT_TIME');
  let order: Order | null = null;
  if (eventStatuses[envelope.event]) {
    const { product, purchase: p } = webhookData.parse(envelope.data);
    if (!eventStatuses[envelope.event].includes(p.status)) throw new ProviderError('EVENT_STATUS_MISMATCH');
    order = { transaction:p.transaction, accountId, productId:product.id, product:product.name, offer:p.offer?.code || null,
      status:p.status, purchasedAt:iso(p.order_date), approvedAt:p.approved_date ? iso(p.approved_date) : null,
      currency:p.full_price.currency_value, gross:minorUnits(p.full_price.value,p.full_price.currency_value), net:null,
      payment:p.payment.type, source:compact(p.origin ?? {}), parentTransaction:p.order_bump?.parent_purchase_transaction || null,
      isBump:p.order_bump?.is_order_bump ?? false, isFunnel:p.is_funnel ?? false };
  }
  // Digest excludes buyer fields, which are neither needed nor persisted.
  const normalized = {id:envelope.id, event:envelope.event, occurredAt:iso(envelope.creation_date), order};
  return { ...normalized, digest:createHash('sha256').update(JSON.stringify(normalized)).digest('hex') };
}
export const historyItem = z.object({ product, purchase:z.object({ ...purchaseBase,
  price:z.object({value,currency_code:currency}), tracking:z.object({source:text.optional(),source_sck:text.optional(),external_code:text.optional()}).optional(),
}) });
export function parseHistory(raw: unknown, accountId: string): Order {
  const { product, purchase:p } = historyItem.parse(raw);
  return {transaction:p.transaction,accountId,productId:product.id,product:product.name,offer:p.offer?.code || null,status:p.status,
    purchasedAt:iso(p.order_date),approvedAt:p.approved_date ? iso(p.approved_date) : null,
    currency:p.price.currency_code,gross:minorUnits(p.price.value,p.price.currency_code),net:null,payment:p.payment.type,
    source:compact({src:p.tracking?.source,sck:p.tracking?.source_sck,xcod:p.tracking?.external_code}),parentTransaction:null,isBump:false,isFunnel:false};
}
const historyPage = z.object({items:z.array(z.unknown()),page_info:z.object({next_page_token:z.string().optional()})});
export async function hotmartToken(deadline: number) {
  const body = new URLSearchParams({grant_type:'client_credentials',client_id:required('HOTMART_CLIENT_ID'),client_secret:required('HOTMART_CLIENT_SECRET')});
  const auth = required('HOTMART_BASIC_AUTH').replace(/^Basic\s+/i,'');
  const json = await providerJson(new URL('https://api-sec-vlc.hotmart.com/security/oauth/token'), {method:'POST',headers:{Authorization:`Basic ${auth}`,'Content-Type':'application/x-www-form-urlencoded'},body},deadline);
  return z.object({access_token:z.string().min(1)}).parse(json).access_token;
}
export async function hotmartPage(token: string, start: number, end: number, status: string, page: string | undefined, deadline: number) {
  const url = new URL('https://developers.hotmart.com/payments/api/v1/sales/history');
  url.search = new URLSearchParams({start_date:String(start),end_date:String(end),transaction_status:status,max_results:process.env.HOTMART_PARTICIPANT_ID?'10':'100',...(page ? {page_token:page} : {})}).toString();
  return historyPage.parse(await providerJson(url,{headers:{Authorization:`Bearer ${token}`}},deadline));
}
const commissions = z.object({items:z.array(z.object({transaction:id,commissions:z.array(z.object({
  commission:z.object({value,currency_value:currency}),user:z.object({ucode:text}),source:text,
}))})),page_info:z.object({next_page_token:z.string().optional()})});
export async function operationCommission(token: string, order: Order, deadline: number): Promise<number | null> {
  const participant = process.env.HOTMART_PARTICIPANT_ID;
  if (!participant || !['APPROVED','COMPLETE'].includes(order.status)) return null;
  const url = new URL('https://developers.hotmart.com/payments/api/v1/sales/commissions');
  url.search = new URLSearchParams({transaction:order.transaction,max_results:'100'}).toString();
  const result = commissions.parse(await providerJson(url,{headers:{Authorization:`Bearer ${token}`}},deadline));
  if (result.page_info.next_page_token) throw new ProviderError('COMMISSION_PAGINATION');
  const rows = result.items.filter(r => r.transaction === order.transaction).flatMap(r => r.commissions).filter(c => c.user.ucode === participant);
  if (!rows.length || rows.some(c => c.commission.currency_value !== order.currency)) return null;
  return rows.reduce((sum,c) => sum + minorUnits(c.commission.value,c.commission.currency_value),0);
}
