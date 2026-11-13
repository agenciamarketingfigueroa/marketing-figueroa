import {type Dataset,type Filters,divide,sumMinor} from './domain';

/** Filtered exports are independent observations; never add them to the ledger. */
export function metaSupplements(data:Dataset,filters:Filters) {
  if(filters.product!=='all')return [];
  const latest=new Map<string,NonNullable<Dataset['manualMetaSupplementalExports']>[number]>();
  for(const source of data.manualMetaSupplementalExports??[]){
    if(source.supersededBy)continue;
    if(source.date<filters.start||source.date>filters.end)continue;
    const key=source.date+'|'+source.filter;
    if(!latest.has(key)||latest.get(key)!.importedAt<source.importedAt)latest.set(key,source);
  }
  return [...latest.values()].sort((a,b)=>b.date.localeCompare(a.date)).flatMap(source=>{
    const rows=source.rows.filter(r=>r.currency===filters.currency&&(filters.account==='all'||r.accountId===filters.account));
    if(!rows.length)return [];
    const sum=(key:'spend'|'purchases'|'purchaseValue'|'clicks'|'views'|'checkouts')=>rows.every(r=>r[key]!==null)?sumMinor(rows.map(r=>r[key]!)):null;
    const spend=sum('spend'),purchases=sum('purchases'),value=sum('purchaseValue');
    const original=data.insights.filter(r=>r.date===source.date&&(r.periodEnd??r.date)===source.date&&r.currency===filters.currency&&(filters.account==='all'||r.accountId===filters.account));
    const knownSpend=original.length?sumMinor(original.map(r=>r.spend)):null;
    return [{...source,rows,spend,purchases,value,roas:divide(value,spend),cpa:divide(spend,purchases),clicks:sum('clicks'),views:sum('views'),checkouts:sum('checkouts'),knownSpend}];
  });
}
