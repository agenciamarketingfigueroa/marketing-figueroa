import { type Dataset,type Filters,select,summarize,dateInZone,divide } from './domain';
import { coversPeriod,mergeCoverage,type CoverageWindow } from './coverage';

export function reportMetrics(data:Dataset,filters:Filters,today=dateInZone(new Date().toISOString()),rows=select(data,filters)) {
  const metrics=summarize(rows.orders,rows.insights,data.mappings);
  const manualMeta=(data.manualPeriods??[]).filter(p=>p.start>=filters.start&&p.end<=filters.end).reduce<CoverageWindow[]>((windows,p)=>mergeCoverage(windows,{start:Date.parse(p.start+'T00:00:00-03:00'),end:Date.parse(p.end+'T23:59:59.999-03:00')}),[]);
  const manualCoverage=(data.manualMetaDailyCoverage??[]).reduce((windows,next)=>mergeCoverage(windows,next),manualMeta);
  const metaCovered=data.mode==='demo'||coversPeriod(data.mode==='manual'?(filters.currency==='BRL'&&filters.product==='all'?manualCoverage:[]):data.coverage?.meta??[],filters.start,filters.end,today);
  const hotmartCovered=(data.mode!=='manual'||filters.account==='all')&&(data.mode==='demo'||coversPeriod(data.coverage?.hotmart??[],filters.start,filters.end,today));
  if(data.mode==='live' && metaCovered && !rows.insights.length) {
    metrics.spend=0;metrics.impressions=0;metrics.clicks=0;metrics.views=0;metrics.checkouts=0;metrics.purchases=0;
  }
  if(data.mode!=='demo' && hotmartCovered && !rows.orders.length) {metrics.gross=0;metrics.net=0;metrics.sales=0;}
  if(data.mode==='manual') {if(!data.manualStatusComplete||!hotmartCovered){metrics.pending=null;metrics.refunds=null;}metrics.trackingRate=null;metrics.attributedRoas=null;}
  metrics.mer=divide(metrics.gross,metrics.spend);
  metrics.profit=metrics.net!==null&&metrics.spend!==null?metrics.net-metrics.spend:null;
  if(!metaCovered) {
    metrics.spend=null;metrics.mer=null;metrics.profit=null;metrics.cpa=null;metrics.cpc=null;metrics.ctr=null;
    metrics.cpm=null;metrics.frequency=null;metrics.metaRoas=null;metrics.attributedRoas=null;
    metrics.impressions=null;metrics.clicks=null;metrics.views=null;metrics.checkouts=null;metrics.purchases=null;
    metrics.costPerView=null;metrics.connectRate=null;metrics.costPerCheckout=null;metrics.pvToCheckout=null;metrics.pvToPurchase=null;
  }
  if(!hotmartCovered) {metrics.gross=null;metrics.net=null;metrics.profit=null;metrics.sales=null;metrics.ticket=null;metrics.mer=null;metrics.attributedRoas=null;metrics.trackingRate=null;}
  // Manual reporting definition agreed with the owner: Meta purchases / approved Hotmart sales.
  if(data.mode==='manual')metrics.trackingRate=divide(metrics.purchases===null?null:metrics.purchases*100,metrics.sales);
  return {metrics,metaCovered,hotmartCovered};
}
