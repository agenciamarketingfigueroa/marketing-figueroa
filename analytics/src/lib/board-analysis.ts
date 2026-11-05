import {type Dataset,type Filters,approved,select,sumMinor,summarize,divide,daysBetween,shiftDay} from './domain';
import {reportMetrics} from './report-metrics';

/** Product names never establish attribution. Shared ads cannot supply product CPA. */
export function productPerformance(data:Dataset,filters:Filters,today:string) {
  const selected=select(data,filters);
  const covered=reportMetrics(data,{...filters,product:'all'},today).metaCovered;
  const groups=new Map<string,Dataset['orders']>();
  for(const order of selected.orders.filter(o=>approved(o.status))) {
    const key=JSON.stringify([order.accountId,order.productId]);
    groups.set(key,[...(groups.get(key)??[]),order]);
  }
  return [...groups].map(([key,orders])=>{
    const first=orders[0];
    const mapped=selected.insights.filter(row=>{
      if(row.idPrecision==='rounded'||data.manualMetaIdPrecision==='rounded')return false;
      const targets=data.mappings.filter(m=>m.accountId===row.accountId&&m.adId===row.adId);
      return targets.length>0&&targets.every(m=>m.hotmartAccountId===first.accountId&&m.productId===first.productId);
    });
    const meta=summarize([],mapped,[]);
    return {key,name:first.product,sales:orders.length,gross:sumMinor(orders.map(o=>o.gross)),
      net:orders.every(o=>o.net!==null)?sumMinor(orders.map(o=>o.net!)):null,
      cpa:covered?meta.cpa:null,spend:covered?meta.spend:null};
  }).sort((a,b)=>b.sales-a.sales||b.gross-a.gross||a.key.localeCompare(b.key));
}

export const forecastFields=['gross','net','sales','spend','purchases'] as const;
export type ForecastValues=Record<typeof forecastFields[number],number|null>;
export interface ForecastMonth extends ForecastValues {start:string;end:string;days:number}
export interface Forecast {
  version:1;organizationId:string;currency:string;target:string;createdOn:string;
  method:'daily-rate-v1';months:ForecastMonth[];base:ForecastValues;
}
export interface ForecastActions {
  load:()=>Promise<Forecast[]>;
  save:(forecast:Forecast)=>Promise<Forecast[]>;
  download:()=>Promise<void>;
  restore:(file:File)=>Promise<Forecast[]>;
}
export function monthRange(month:string) {
  const start=month+'-01';
  const next=new Date(start+'T12:00:00Z');next.setUTCMonth(next.getUTCMonth()+1);
  return {start,end:shiftDay(next.toISOString().slice(0,10),-1)};
}
export function nextMonth(today:string) {return shiftDay(monthRange(today.slice(0,7)).end,1).slice(0,7);}
export const forecastKey=(f:Forecast)=>JSON.stringify([f.organizationId,f.currency,f.target]);

/** Closed, fully covered calendar months only; no partial month extrapolation in the base. */
export function buildForecast(data:Dataset,currency:string,target:string,today:string):Forecast|null {
  if(!/^\d{4}-(0[1-9]|1[0-2])$/.test(target)||target<=today.slice(0,7))return null;
  const months:ForecastMonth[]=[];
  let cursor=today.slice(0,7);
  for(let i=0;i<6&&months.length<3;i++) {
    cursor=shiftDay(cursor+'-01',-1).slice(0,7);
    const range=monthRange(cursor);
    const {metrics:m,hotmartCovered}=reportMetrics(data,{...range,currency,account:'all',product:'all'},today);
    if(!hotmartCovered||m.gross===null||m.sales===null)continue;
    months.push({...range,days:daysBetween(range.start,range.end),gross:m.gross,net:m.net,sales:m.sales,spend:m.spend,purchases:m.purchases});
  }
  if(!months.length)return null;
  months.reverse();
  const range=monthRange(target),days=daysBetween(range.start,range.end);
  const base=Object.fromEntries(forecastFields.map(key=>[key,months.every(m=>m[key]!==null)
    ?Math.round(sumMinor(months.map(m=>m[key]!))/months.reduce((sum,m)=>sum+m.days,0)*days):null])) as ForecastValues;
  return {version:1,organizationId:data.organizationId,currency,target,createdOn:today,method:'daily-rate-v1',months,base};
}
export function forecastScenario(forecast:Forecast,multiplier:number):ForecastValues {
  return Object.fromEntries(forecastFields.map(key=>[key,forecast.base[key]===null?null:
    key==='spend'?forecast.base[key]:Math.round(forecast.base[key]!*multiplier)])) as ForecastValues;
}
export function forecastRatios(values:ForecastValues) {return {cpa:divide(values.spend,values.purchases),mer:divide(values.gross,values.spend)};}

/** Compare only a contiguous, closed prefix of the target month, separately per provider. */
export function forecastActual(data:Dataset,forecast:Forecast,today:string) {
  const range=monthRange(forecast.target);
  const last=range.end<today?range.end:shiftDay(today,-1);
  let hotmart:({through:string;gross:number|null;net:number|null;sales:number|null})|null=null;
  let meta:({through:string;spend:number|null;purchases:number|null})|null=null;
  for(let end=last;end>=range.start;end=shiftDay(end,-1)) {
    const result=reportMetrics(data,{start:range.start,end,currency:forecast.currency,account:'all',product:'all'},today);
    const m=result.metrics;
    if(!hotmart&&result.hotmartCovered)hotmart={through:end,gross:m.gross,net:m.net,sales:m.sales};
    if(!meta&&result.metaCovered)meta={through:end,spend:m.spend,purchases:m.purchases};
    if(hotmart&&meta)break;
  }
  return {hotmart,meta};
}
