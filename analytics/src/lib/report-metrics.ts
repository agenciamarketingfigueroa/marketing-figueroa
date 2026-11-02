import { type Dataset,type Filters,select,summarize,dateInZone,divide } from './domain';
import { coversPeriod } from './coverage';

export function reportMetrics(data:Dataset,filters:Filters,today=dateInZone(new Date().toISOString()),rows=select(data,filters)) {
  const metrics=summarize(rows.orders,rows.insights,data.mappings);
  const metaCovered=data.mode==='demo'||coversPeriod(data.coverage?.meta??[],filters.start,filters.end,today);
  const hotmartCovered=data.mode==='demo'||coversPeriod(data.coverage?.hotmart??[],filters.start,filters.end,today);
  if(data.mode==='live' && metaCovered && !rows.insights.length) {
    metrics.spend=0;metrics.impressions=0;metrics.clicks=0;metrics.views=0;metrics.checkouts=0;metrics.purchases=0;
  }
  if(data.mode==='live' && hotmartCovered && !rows.orders.length) {metrics.gross=0;metrics.net=0;metrics.sales=0;}
  metrics.mer=divide(metrics.gross,metrics.spend);
  metrics.profit=metrics.net!==null&&metrics.spend!==null?metrics.net-metrics.spend:null;
  if(!metaCovered) {
    metrics.spend=null;metrics.mer=null;metrics.profit=null;metrics.cpa=null;metrics.cpc=null;metrics.ctr=null;
    metrics.cpm=null;metrics.frequency=null;metrics.metaRoas=null;metrics.attributedRoas=null;
    metrics.impressions=null;metrics.clicks=null;metrics.views=null;metrics.checkouts=null;metrics.purchases=null;
    metrics.costPerView=null;metrics.connectRate=null;metrics.costPerCheckout=null;metrics.pvToCheckout=null;metrics.pvToPurchase=null;
  }
  if(!hotmartCovered) {metrics.gross=null;metrics.net=null;metrics.profit=null;metrics.sales=null;metrics.ticket=null;metrics.mer=null;metrics.attributedRoas=null;metrics.trackingRate=null;}
  return {metrics,metaCovered,hotmartCovered};
}
