import { type Filters, fractionDigits, type summarize } from './domain';

/** No raw buyer data. Explicit units make exported financial figures reviewable. */
export function reportCsv(metrics:ReturnType<typeof summarize>,filters:Filters,demo:boolean) {
  const monetary=new Set(['spend','gross','net','profit','ticket','cpa','cpc','cpm','costPerView','costPerCheckout']);
  const percentages=new Set(['ctr','connectRate','pvToCheckout','pvToPurchase','trackingRate']);
  const ratios=new Set(['mer','metaRoas','attributedRoas','frequency']);
  const rows=[['modo','inicio','fim','moeda','conta','produto','indicador','unidade','valor'],...Object.entries(metrics).map(([key,value])=>[
    demo?'DEMONSTRACAO':'REAL',filters.start,filters.end,filters.currency,filters.account,filters.product,key,
    monetary.has(key)?filters.currency:ratios.has(key)?'razao':percentages.has(key)?'percentual':'quantidade',
    value===null?'indisponivel':monetary.has(key)?(value/10**fractionDigits(filters.currency)).toFixed(fractionDigits(filters.currency)):String(value),
  ])];
  const escape=(cell:string)=>`"${(/^[=+@\-\t\r]/.test(cell)?"'"+cell:cell).replaceAll('"','""')}"`;
  return '\uFEFF'+rows.map(row=>row.map(escape).join(';')).join('\r\n');
}
