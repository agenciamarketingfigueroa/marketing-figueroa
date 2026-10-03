export const sums = ['spend','gross','net','sales','brlSales','usdGross','usdNet','usdSales','clicks','views','checkouts','purchases','metaRevenue','days'];
export const divide = (a,b) => b ? a/b : null;
export function metrics(value) {
  return {...value, profit:value.net-value.spend, deductions:value.gross-value.net,
    roas:divide(value.gross,value.spend), metaRoas:divide(value.metaRevenue,value.spend),
    margin:divide(value.net-value.spend,value.gross), ticket:divide(value.gross,value.brlSales),
    cpa:divide(value.spend,value.purchases), cpc:divide(value.spend,value.clicks),
    connect:divide(value.views,value.clicks), conversion:divide(value.purchases,value.views)};
}
export function aggregate(weeks) {
  const result = Object.fromEntries(sums.map(k=>[k,weeks.reduce((s,w)=>s+(w[k]||0),0)]));
  for (const collection of ['products','ads']) {
    const groups = new Map();
    weeks.forEach(w=>w[collection].forEach(row=>{
      if (!groups.has(row.name)) groups.set(row.name,{name:row.name});
      const group=groups.get(row.name);
      Object.entries(row).forEach(([k,v])=>{if (typeof v==='number') group[k]=(group[k]||0)+v;});
    }));
    result[collection]=[...groups.values()];
  }
  result.daily=weeks.flatMap(w=>w.daily);
  result.start=weeks[0].start; result.end=weeks.at(-1).end;
  return metrics(result);
}
