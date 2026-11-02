import { type Dataset,type Filters,type Order,type Insight,type FollowerSnapshot,select,orderDay,daysBetween,shiftDay,dateInZone,fractionDigits,summarize } from './domain';
import { reportMetrics } from './report-metrics';

export function dailyPerformance(data:Dataset,filters:Filters,today=dateInZone(new Date().toISOString())) {
  const selected=select(data,filters);const orders=new Map<string,Order[]>();const insights=new Map<string,Insight[]>();
  for(const o of selected.orders) {const day=orderDay(o);orders.set(day,[...(orders.get(day)??[]),o]);}
  for(const i of selected.insights) insights.set(i.date,[...(insights.get(i.date)??[]),i]);
  let cumulativeRevenue:number|null=0;let cumulativeSpend:number|null=0;let cumulativeSales:number|null=0;
  const factor=10**fractionDigits(filters.currency);
  return Array.from({length:daysBetween(filters.start,filters.end)},(_,i)=>{
    const day=shiftDay(filters.start,i);
    const m=reportMetrics(data,{...filters,start:day,end:day},today,{orders:orders.get(day)??[],insights:insights.get(day)??[]}).metrics;
    // A gap invalidates the cumulative total; never bridge missing history with a made-up zero.
    cumulativeRevenue=cumulativeRevenue===null||m.gross===null?null:cumulativeRevenue+m.gross/factor;
    cumulativeSpend=cumulativeSpend===null||m.spend===null?null:cumulativeSpend+m.spend/factor;
    cumulativeSales=cumulativeSales===null||m.sales===null?null:cumulativeSales+m.sales;
    return {day,label:day.slice(8)+'/'+day.slice(5,7),revenue:m.gross===null?null:m.gross/factor,spend:m.spend===null?null:m.spend/factor,sales:m.sales,mer:m.mer,cpa:m.cpa===null?null:m.cpa/factor,roas:m.metaRoas,cumulativeRevenue,cumulativeSpend,cumulativeSales};
  });
}
export function followerSummary(snapshots:FollowerSnapshot[],start:string,end:string,accountId:string) {
  const points=snapshots.filter(s=>s.accountId===accountId&&s.date>=start&&s.date<=end).sort((a,b)=>a.date.localeCompare(b.date));
  const before=snapshots.filter(s=>s.accountId===accountId&&s.date<start).sort((a,b)=>b.date.localeCompare(a.date))[0];
  const latest=points.at(-1)??null;const baseline=before??points[0]??null;
  const delta=latest&&baseline&&latest.date!==baseline.date?latest.followers-baseline.followers:null;
  return {points,latest,baseline,delta,percent:delta!==null&&baseline?.followers?delta/baseline.followers*100:null,partialBaseline:!before};
}
export function rankedCreatives(data:Dataset,filters:Filters,sort:'roas'|'purchases'|'spend',minSpend:number) {
  const selected=select(data,filters);const groups=new Map<string,Insight[]>();
  for(const row of selected.insights) {const key=`${row.accountId}:${row.adId}`;groups.set(key,[...(groups.get(key)??[]),row]);}
  return [...groups].map(([key,rows])=>({key,ad:rows[0],creative:data.creatives?.find(c=>c.accountId===rows[0].accountId&&c.adId===rows[0].adId),metrics:summarize([],rows,[])}))
    .filter(r=>(r.metrics.spend??0)>=minSpend).sort((a,b)=>{
      const av=sort==='roas'?a.metrics.metaRoas:a.metrics[sort];const bv=sort==='roas'?b.metrics.metaRoas:b.metrics[sort];
      return av===null?1:bv===null?-1:bv-av;
    });
}
