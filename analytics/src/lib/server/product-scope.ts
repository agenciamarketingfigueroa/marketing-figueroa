import 'server-only';
/** Fail closed until the operation's product list is configured. */
export function hotmartProductScope(raw=process.env.HOTMART_PRODUCT_IDS):Set<string> {
  const ids=raw?.split(',').map(value=>value.trim());
  if(!ids?.length||ids.some(id=>!/^\d+$/.test(id))) throw new Error('HOTMART_PRODUCTS_NOT_CONFIGURED');
  return new Set(ids);
}
