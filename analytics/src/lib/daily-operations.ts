import {type Dataset,type Filters,dateInZone,shiftDay} from './domain';
import {analyzeCreatives,projectFinancial,scopeMvave,strategicFinancial,type CreativeAnalysis} from './strategic-report';

export function metricTone(key:string,change:number|null):'positive'|'negative'|'neutral' {
  if(change===null||!Number.isFinite(change)||change===0||['spend','impressions','clicks','pending'].includes(key))return 'neutral';
  const inverse=['cpa','cpc','cpm','refunds'].includes(key);
  return (inverse?change<0:change>0)?'positive':'negative';
}
export type CreativeFilter='current'|'active'|'all'|'paused'|'idle'|'unknown';
export function filterCreatives(rows:CreativeAnalysis[],filter:CreativeFilter){
  return rows.filter(c=>filter==='all'||(filter==='current'?c.activeAtEnd:filter==='active'?c.activeInPeriod:filter==='paused'?['PAUSED','INACTIVE'].includes(c.status):filter==='idle'?c.status==='NOT_DELIVERING':!['ACTIVE','PAUSED','INACTIVE','NOT_DELIVERING'].includes(c.status)));
}
export function dailyDates(data:Dataset,f:Filters,today=dateInZone(new Date().toISOString())){
  return [...new Set(data.insights.filter(r=>r.currency===f.currency&&r.date<=today&&(!r.periodEnd||r.periodEnd===r.date)&&(f.account==='all'||r.accountId===f.account)&&(r.granularity??'ad')==='ad').map(r=>r.date))].sort().reverse();
}
/** Most recent observed date, not upload order. Backfills cannot replace today's work. */
export function dailyOperations(input:Dataset,f:Filters,today=dateInZone(new Date().toISOString()),requestedDay?:string,dailyBudget?:number){
  const data=scopeMvave(input).data,dates=dailyDates(data,f,today),day=requestedDay??dates[0]??null;
  const filters={...f,start:day??f.end,end:day??f.end};
  const available=Boolean(day&&dates.includes(day));
  const all=available?analyzeCreatives(data,filters,today,true):[];
  const current=all.filter(c=>c.activeAtEnd);
  const context=available?analyzeCreatives(data,{...filters,start:shiftDay(filters.end,-6)},today,true):[];
  const projection=projectFinancial(data,filters,today,dailyBudget,null,[1]);
  // A partial current day never yields a forecast labelled as tomorrow.
  if(!available||day===today){projection.enough=false;projection.scenarios=[];projection.limitation=available?'Feche o dia atual para estimar o próximo dia.':'Importe um relatório diário para gerar a estimativa.';}
  return {day,dates,filters,available,current,all,context,projection,
    financial:strategicFinancial(data,filters,today),previous:strategicFinancial(data,{...filters,start:shiftDay(filters.start,-1),end:shiftDay(filters.end,-1)},today),
    sources:[...new Set((data.manualPeriods??[]).filter(p=>p.start<=filters.end&&p.end>=filters.start).flatMap(p=>p.sources.map(s=>s.sha256??s.name)))],
    unknown:all.filter(c=>!['ACTIVE','PAUSED','INACTIVE','NOT_DELIVERING'].includes(c.status)).length,
    paused:all.filter(c=>['PAUSED','INACTIVE','NOT_DELIVERING'].includes(c.status)).length,
  };
}
export const actionGroups=[
  {id:'pause',title:'Pausar',description:'Campanhas ou conjuntos com pausa proposta.'},
  {id:'reduce',title:'Reduzir investimento',description:'Reduções sustentadas pelos dados.'},
  {id:'increase',title:'Aumentar investimento',description:'Oportunidades com margem e recorrência.'},
  {id:'review',title:'Revisar tracking / estrutura',description:'Pendências que impedem uma decisão segura.'},
  {id:'observe',title:'Manter e acompanhar',description:'Preservar entrega e acompanhar os próximos fechamentos.'},
] as const;
export function actionGroup(decision:string){return /^Pausar/.test(decision)?'pause':/^Reduzir/.test(decision)?'reduce':/^Aumentar|Candidato/.test(decision)?'increase':/^Revisar/.test(decision)?'review':'observe';}
