import {type Dataset,type Filters,type Order,type Insight,approved,orderDay,select,shiftDay,daysBetween,divide,sumMinor,variation,previousPeriod,dateInZone,money} from './domain';
import {reportMetrics} from './report-metrics';
import {coversPeriod} from './coverage';
import products from '../../../analise-mvave-br/config/produtos_mvave_br.json';

const mainIds=new Set(Object.entries(products).filter(([,p])=>p.category==='principal').map(([id])=>id));
const standaloneDates=new Map<string,string[]>(Object.entries(products).map(([id,p])=>[id,'standaloneSaleDates' in p?p.standaloneSaleDates:[]]));
const confirmedPrincipal=(o:Order)=>mainIds.has(o.productId)||Boolean(standaloneDates.get(o.productId)?.includes(orderDay(o))&&o.currency==='BRL'&&o.product===products[o.productId as keyof typeof products]?.name&&!o.parentTransaction&&!o.isBump&&!o.isFunnel);
export type SaleKind='principal'|'bump'|'upsell'|'upgrade'|'review';
export const principalKey=(o:Order)=>o.mainOrderId??o.transaction;
export function saleKind(o:Order):SaleKind {
  if(o.isBump)return 'bump';
  if(o.isFunnel)return o.additionalKind??'review';
  return confirmedPrincipal(o)&&!o.parentTransaction?'principal':'review';
}
/** Confirmed principals (including dated standalone sales) and linked additions. */
export function scopeMvave(data:Dataset){
  const main=new Set(data.orders.filter(o=>confirmedPrincipal(o)&&!o.isBump&&!o.isFunnel).map(o=>o.transaction));
  const accepted=data.orders.filter(o=>confirmedPrincipal(o)||Boolean(o.parentTransaction&&main.has(o.parentTransaction)));
  const excluded=[...data.excludedOperationOrders??[],...data.orders.filter(o=>!accepted.includes(o))];
  return {data:{...data,orders:accepted,excludedOperationOrders:excluded},excluded};
}
function exactSck(data:Dataset,o:Order){const a=o.sckAttribution;return a?.status==='exact'&&[...data.insights,...data.manualMetaAggregates??[]].some(i=>i.accountId===a.accountId&&i.adId===a.adId&&i.idPrecision==='exact'&&Boolean(i.exportAdId)&&(i.granularity??'ad')==='ad');}
const sum=(rows:Order[],key:'gross'|'net')=>rows.every(r=>r[key]!==null)?sumMinor(rows.map(r=>r[key]!)):null;
export function strategicFinancial(data:Dataset,f:Filters,today:string){
  const selected=select(data,f),coverage=reportMetrics(data,f,today,selected),m=coverage.metrics;
  const sales=selected.orders.filter(o=>approved(o.status)),main=sales.filter(o=>saleKind(o)==='principal');
  const count=coverage.hotmartCovered?new Set(main.map(principalKey)).size:null;
  const frontGross=coverage.hotmartCovered?sum(main,'gross'):null,frontNet=coverage.hotmartCovered?sum(main,'net'):null;
  const additions=(['bump','upsell','upgrade'] as const).map(kind=>{const rows=sales.filter(o=>saleKind(o)===kind);return {kind,count:coverage.hotmartCovered?rows.length:null,gross:coverage.hotmartCovered?sum(rows,'gross'):null,net:coverage.hotmartCovered?sum(rows,'net'):null};});
  const confirmed=sales.filter(o=>saleKind(o)!=='review');
  const gross=coverage.hotmartCovered?sum(confirmed,'gross'):null,net=coverage.hotmartCovered?sum(confirmed,'net'):null;
  const direct=main.filter(o=>exactSck(data,o)),directCount=coverage.hotmartCovered?new Set(direct.map(principalKey)).size:null;
  const values={spend:m.spend,main:count,frontGross,frontNet,gross,net,cpa:divide(m.spend,count),roas:divide(frontGross,m.spend),totalRoas:divide(gross,m.spend),netMedia:divide(frontNet,m.spend),totalNetMedia:divide(net,m.spend),contribution:net!==null&&m.spend!==null?net-m.spend:null,frontContribution:frontNet!==null&&m.spend!==null?frontNet-m.spend:null,ticketGross:divide(frontGross,count),ticketNet:divide(frontNet,count),direct:directCount,blended:count!==null&&directCount!==null?count-directCount:null,sckCoverage:divide(directCount===null?null:100*directCount,count),buyers:coverage.hotmartCovered&&main.every(o=>o.buyerRef)?new Set(main.map(o=>o.buyerRef)).size:null,metaPurchases:m.purchases,metaValue:selected.insights.length&&selected.insights.every(r=>r.purchaseValue!==null)&&coverage.metaCovered?sumMinor(selected.insights.map(r=>r.purchaseValue!)):null,impressions:m.impressions,clicks:m.clicks,views:m.views,checkouts:m.checkouts,ctr:m.ctr,cpc:m.cpc,cpm:m.cpm,connectRate:m.connectRate,lpvCheckout:m.pvToCheckout,checkoutPurchase:divide(count===null?null:count*100,m.checkouts),lpvPurchase:divide(count===null?null:count*100,m.views),pending:m.pending,refunds:m.refunds};
  return {...values,additions,review:sales.filter(o=>saleKind(o)==='review').length,metaCovered:coverage.metaCovered,hotmartCovered:coverage.hotmartCovered,complete:coverage.metaCovered&&coverage.hotmartCovered};
}
export type Financial=ReturnType<typeof strategicFinancial>;
export type FinancialKey={ [K in keyof Financial]: Financial[K] extends number|null ? K : never }[keyof Financial];
export const financialRows:{key:FinancialKey;label:string;format:'money'|'count'|'ratio'|'percent'}[]=[
  {key:'spend',label:'Investimento em mídia',format:'money'},{key:'main',label:'Compras principais',format:'count'},
  {key:'frontGross',label:'Bruto front-end',format:'money'},{key:'frontNet',label:'Líquido front-end',format:'money'},
  {key:'cpa',label:'CPA consolidado · mídia / principais',format:'money'},{key:'roas',label:'ROAS bruto front-end',format:'ratio'},
  {key:'netMedia',label:'Líquido front-end / mídia',format:'ratio'},{key:'frontContribution',label:'Contribuição front-end',format:'money'},
  {key:'ticketGross',label:'Ticket bruto principal',format:'money'},{key:'ticketNet',label:'Ticket líquido principal',format:'money'},
  {key:'gross',label:'Bruto consolidado com adicionais',format:'money'},{key:'net',label:'Líquido consolidado com adicionais',format:'money'},
  {key:'contribution',label:'Contribuição total após mídia',format:'money'},{key:'sckCoverage',label:'Cobertura SCK exata · principais',format:'percent'},
];
export const formatValue=(v:number|null,format:'money'|'count'|'ratio'|'percent',currency='BRL')=>v===null?'—':format==='money'?money(v,currency):v.toLocaleString('pt-BR',{maximumFractionDigits:format==='count'?2:2})+(format==='ratio'?'×':format==='percent'?'%':'');
export const creativeFamily=(name:string)=>/\b[GBV]S\d|sorteio/i.test(name)?/RMKT|remarketing/i.test(name)?'Sorteio remarketing':'Sorteio público frio':'Tradicional';
const instrument=(name:string)=>/viol[aã]o|\[VL\]|\bVS\d/i.test(name)?'Violão':/baixo|\[BX\]|\bBS\d/i.test(name)?'Baixo':/guitarra|\[GT\]|\bGS\d/i.test(name)?'Guitarra':/completo/i.test(name)?'Completo':'Não informado';
const metaSum=(rows:Insight[],key:'clicks'|'views'|'checkouts'|'purchases')=>rows.length&&rows.every(r=>r[key]!==null)?rows.reduce((s,r)=>s+r[key]!,0):null;
export function analyzeCreatives(data:Dataset,f:Filters,today:string,dailyOnly=false){
  const rows=select(data,f,dailyOnly).insights,previous=select(data,previousPeriod(f),dailyOnly).insights;
  const financialCovered=reportMetrics(data,f,today).hotmartCovered;
  const sales=select(data,f).orders.filter(o=>approved(o.status)&&saleKind(o)==='principal');
  const groups=new Map<string,Insight[]>();for(const r of rows){const key=r.accountId+'|'+r.adId;groups.set(key,[...groups.get(key)??[],r]);}
  for(const o of sales.filter(o=>o.sckAttribution?.status==='exact')){const a=o.sckAttribution!;const historic=[...data.insights,...data.manualMetaAggregates??[]].find(r=>r.adId===a.adId&&r.accountId===a.accountId);if(historic&&!groups.has(historic.accountId+'|'+historic.adId))groups.set(historic.accountId+'|'+historic.adId,[]);}
  return [...groups].map(([key,unsorted])=>{
    const items=[...unsorted].sort((a,b)=>(a.periodEnd??a.date).localeCompare(b.periodEnd??b.date));
    const [accountId,adId]=key.split('|');const first=items.at(-1)??[...data.insights,...data.manualMetaAggregates??[]].find(r=>r.accountId===accountId&&r.adId===adId)!;
    const exact=first.idPrecision==='exact'&&Boolean(first.exportAdId)&&(first.granularity??'ad')==='ad'&&items.every(r=>r.idPrecision==='exact'&&(r.granularity??'ad')==='ad');
    const direct=sales.filter(o=>exactSck(data,o)&&o.sckAttribution?.adId===adId&&o.sckAttribution.accountId===accountId);
    const spend=items.length?sumMinor(items.map(r=>r.spend)):null;
    const orders=exact&&financialCovered?new Set(direct.map(principalKey)).size:null,gross=exact&&financialCovered?sum(direct,'gross'):null,net=exact&&financialCovered?sum(direct,'net'):null;
    const contribution=spend!==null&&net!==null?net-spend:null;
    const prior=previous.filter(r=>r.accountId===accountId&&r.adId===adId),priorSpend=prior.length?sumMinor(prior.map(r=>r.spend)):null;
    const recurringDays=new Set(direct.map(orderDay)).size;
    const late=direct.some(o=>o.sckAttribution?.possiblyLate)||direct.length>0&&(spend===null||spend===0||first.status==='PAUSED');
    const strategy=/\bPERFORMANCE\b/i.test(first.campaign)?'PERFORMANCE':/\bLAB\b/i.test(first.campaign)?'LAB':'Não confirmada';
    const budget=first.budget??null;
    const knownDays=[...new Set(items.filter(r=>!r.periodEnd||r.periodEnd===r.date).map(r=>r.date))].sort();
    const timeline=knownDays.map(day=>{const rs=items.filter(r=>r.date===day);const os=direct.filter(o=>orderDay(o)===day);return {day,spend:sumMinor(rs.map(r=>r.spend)),orders:exact?new Set(os.map(principalKey)).size:null,budget:rs.at(-1)?.budget??null};});
    const changes=timeline.slice(1).flatMap((r,i)=>r.budget!==null&&timeline[i].budget!==null&&r.budget!==timeline[i].budget?[{day:r.day,before:timeline[i].budget!,after:r.budget}]:[]);
    const decision=!exact?'Revisar tracking/estrutura':late?'Manter sob observação':strategy==='LAB'?'Continuar teste na LAB':'Manter sob observação';
    const reason=!exact?'O ID não permite confirmar SCK. Compras Meta e indicadores de clique não autorizam atribuir receita nem decidir corte/escala.':late?'Conversão possivelmente tardia: preservar a origem histórica e não dividir receita por gasto zero.':`${recurringDays} dias com compras diretas e contribuição ${money(contribution,f.currency)}. Revisar contexto e janelas antes de mudar orçamento.`;
    const dailyEvidence=data.insights.filter(r=>r.accountId===accountId&&r.adId===adId&&r.currency===f.currency&&r.date>=f.start&&r.date<=f.end&&(!r.periodEnd||r.periodEnd===r.date));
    return {key,id:adId,exportId:first.exportAdId??null,name:first.ad,accountId,instrument:instrument(first.ad),campaign:first.campaign,adset:first.adset,strategy,family:creativeFamily(first.ad),budget,budgetScope:'conjunto informado no export',status:first.status,activeAtEnd:dailyEvidence.some(r=>r.date===f.end&&r.status==='ACTIVE'),activeInPeriod:dailyEvidence.some(r=>r.status==='ACTIVE'),spend,orders,gross,net,cpa:divide(spend,orders),roas:divide(gross,spend),contribution,priorSpend,growth:variation(spend,priorSpend),recurringDays,late,exact,timeline,changes,clicks:metaSum(items,'clicks'),views:metaSum(items,'views'),checkouts:metaSum(items,'checkouts'),metaPurchases:metaSum(items,'purchases'),decision,reason,suggestedBudget:null as number|null,sourceHashes:[...new Set(items.map(r=>r.sourceHash).filter(Boolean))]};
  }).sort((a,b)=>(b.spend??-1)-(a.spend??-1));
}
export type CreativeAnalysis=ReturnType<typeof analyzeCreatives>[number];
export function quantile(values:number[],q:number){if(!values.length)return null;const sorted=[...values].sort((a,b)=>a-b);const index=(sorted.length-1)*q,low=Math.floor(index),part=index-low;return sorted[low]+((sorted[low+1]??sorted[low])-sorted[low])*part;}
export function projectFinancial(data:Dataset,f:Filters,today:string,dailyBudget?:number,goal:number|null=f.currency==='BRL'?1_000_000:null,horizons:readonly number[]=[7,14,30]){
  if(dailyBudget!==undefined&&(!Number.isSafeInteger(dailyBudget)||dailyBudget<0))throw Error('Investimento diário inválido.');
  if(goal!==null&&(!Number.isSafeInteger(goal)||goal<0))throw Error('Meta financeira inválida.');
  const end=f.end>=today?shiftDay(today,-1):f.end,start=shiftDay(end,-29);
  const history=Array.from({length:30},(_,i)=>{const day=shiftDay(start,i);return {day,...strategicFinancial(data,{...f,start:day,end:day},today)};});
  const complete=history.filter(r=>r.complete&&r.frontGross!==null&&r.frontNet!==null&&r.main!==null&&r.spend!==null);
  const usable=complete.filter(r=>r.spend!>0);
  const last7=complete.filter(r=>r.day>=shiftDay(end,-6));
  const observedSpend=last7.length?Math.round(last7.reduce((s,r)=>s+r.spend!,0)/last7.length):null;
  const assumedSpend=dailyBudget!==undefined&&Number.isSafeInteger(dailyBudget)&&dailyBudget>=0?dailyBudget:observedSpend;
  const main=usable.reduce((s,r)=>s+r.main!,0),frontGross=usable.reduce((s,r)=>s+r.frontGross!,0),frontNet=usable.reduce((s,r)=>s+r.frontNet!,0);
  const ticketGross=divide(frontGross,main),ticketNet=divide(frontNet,main);
  const enough=usable.length>=7&&main>=7&&ticketGross!==null&&ticketNet!==null&&assumedSpend!==null;
  const efficiency=usable.map(r=>r.main!/r.spend!);
  const extras=(['bump','upsell','upgrade'] as const).map(kind=>{const days=usable.map(r=>r.additions.find(a=>a.kind===kind)!);const count=days.reduce((s,a)=>s+(a.count??0),0),activeDays=days.filter(a=>(a.count??0)>0).length;const valid=main>=20&&count>=5&&activeDays>=3&&days.every(a=>a.net!==null&&a.gross!==null);return {kind,supported:valid,count,activeDays,rate:valid?count/main:null,ticketGross:valid?days.reduce((s,a)=>s+a.gross!,0)/count:null,ticketNet:valid?days.reduce((s,a)=>s+a.net!,0)/count:null};});
  const cv=usable.length&&quantile(efficiency,.5)!>0?(quantile(efficiency,.75)!-quantile(efficiency,.25)!)/quantile(efficiency,.5)!:null;
  const media=data.insights.filter(r=>r.currency===f.currency&&r.date<=end&&(f.account==='all'||r.accountId===f.account));
  const priorIdentities=new Set(media.filter(r=>r.date<shiftDay(end,-6)).map(r=>r.accountId+'|'+r.adId));
  const recentIdentities=priorIdentities.size?new Set(media.filter(r=>r.date>=shiftDay(end,-6)&&r.spend>0&&!priorIdentities.has(r.accountId+'|'+r.adId)).map(r=>r.accountId+'|'+r.adId)).size:0;
  const confidence=usable.length<14||complete.length<30||cv===null||cv>1||dailyBudget!==undefined||recentIdentities>0?'Baixo':'Moderado';
  const scenarios=enough?horizons.map(horizon=>{
    const ending=shiftDay(end,horizon),rollingStart=shiftDay(ending,-29);
    const remaining=rollingStart<=end?strategicFinancial(data,{...f,start:rollingStart,end},today):null;
    const expiredEnd=shiftDay(rollingStart,-1);const expired=expiredEnd>=start?strategicFinancial(data,{...f,start,end:expiredEnd>end?end:expiredEnd},today):null;
    return {horizon,ending,remainingGross:remaining?.gross??(rollingStart>end?0:null),expiringGross:expired?.gross??null,values:([{label:'Conservador',q:.25},{label:'Base',q:.5},{label:'Otimista',q:.75}] as const).map(({label,q})=>{
      const e=quantile(efficiency,q)!,spend=assumedSpend!*horizon,orders=Math.round(spend*e*100)/100;
      const gross=Math.round(orders*ticketGross!),net=Math.round(orders*ticketNet!);
      const additional=extras.map(x=>({...x,projectedCount:x.supported?orders*x.rate!:null,gross:x.supported?Math.round(orders*x.rate!*x.ticketGross!):null,net:x.supported?Math.round(orders*x.rate!*x.ticketNet!):null}));
      const totalGross=gross+additional.reduce((s,a)=>s+(a.gross??0),0),totalNet=net+additional.reduce((s,a)=>s+(a.net??0),0);
      const residual=remaining?.gross??(rollingStart>end?0:null);
      return {label,percentile:q,efficiency:e,spend,orders,cpa:divide(spend,orders),gross,net,roas:divide(gross,spend),netMedia:divide(net,spend),contribution:net-spend,additional,totalGross,totalNet,totalContribution:totalNet-spend,rollingGross:residual===null?null:residual+totalGross};
    })};
  }):[];
  return {start,end,history,usableDays:usable.length,missingDays:history.filter(r=>!r.complete).map(r=>r.day),days:usable.map(r=>r.day),last7,assumedSpend,spendSource:dailyBudget!==undefined?'Premissa informada pelo gestor':'Média do gasto diário observado nos últimos sete dias disponíveis',ticketGross,ticketNet,extras,confidence,confidenceReason:`${usable.length} dias completos com mídia positiva, ${main} compras principais. Dispersão interquartil/mediana ${cv===null?'indisponível':cv.toFixed(2)}. ${recentIdentities} identidades de anúncios com gasto aparecem pela primeira vez nos últimos sete dias da base; isso pode refletir novos anúncios ou mudança no export, não comprova lançamento. Mudanças recentes de estratégia e filtros de exportação reduzem a confiança; classificação não é probabilidade.`,enough,limitation:enough?null:'São necessários ao menos 7 dias completos com mídia positiva e 7 compras principais para este modelo. Não projetar com a amostra atual.',scenarios,goal,currency:f.currency};
}
export const reportSections=['Diagnóstico executivo','Indicadores financeiros principais','Fechamento financeiro detalhado','Tracking e conciliação Meta × Hotmart','Análise do funil','Ranking completo dos criativos','Leitura individual dos criativos','Análise estratégica por grupo','Evolução histórica','Plano de ação operacional','Projeções financeiras'];
export function buildStrategicReport(input:Dataset,f:Filters,today=dateInZone(new Date().toISOString()),dailyBudget?:number,goal:number|null=f.currency==='BRL'?1_000_000:null){
  const keys=new Set<string>();for(const o of input.orders){const key=[o.accountId,o.transaction,o.productId].join('|');if(keys.has(key))throw Error('Transação/item duplicado na base. Reconcilie a origem antes de gerar o relatório.');keys.add(key);}
  if(!Number.isFinite(daysBetween(f.start,f.end))||daysBetween(f.start,f.end)<1)throw Error('Período inválido.');
  const scoped=scopeMvave(input),data=scoped.data,current=strategicFinancial(data,f,today),previous=strategicFinancial(data,previousPeriod(f),today);
  const days=Array.from({length:daysBetween(f.start,f.end)},(_,i)=>{const day=shiftDay(f.start,i);return {day,...strategicFinancial(data,{...f,start:day,end:day},today)};});
  const creatives=analyzeCreatives(data,f,today),totalSpend=creatives.reduce((s,r)=>s+(r.spend??0),0);let running=0;
  const relevant=creatives.filter(r=>{const top=running<totalSpend*.8;running+=r.spend??0;return top||(r.orders??0)>0||r.changes.length>0;});
  const residual=creatives.filter(r=>!relevant.includes(r));
  const group=(field:'family'|'strategy')=>[...new Set(creatives.map(r=>r[field]))].map(name=>{const rows=creatives.filter(r=>r[field]===name),complete=rows.every(r=>r.exact&&r.spend!==null);const spend=sumMinor(rows.map(r=>r.spend??0)),orders=complete?rows.reduce((s,r)=>s+r.orders!,0):null,gross=complete?sumMinor(rows.map(r=>r.gross!)):null,net=complete&&rows.every(r=>r.net!==null)?sumMinor(rows.map(r=>r.net!)):null;return {name,spend,orders,cpa:divide(spend,orders),roas:divide(gross,spend),contribution:net===null?null:net-spend};});
  const windows=[3,7,14,30].map(length=>({length,start:shiftDay(f.end,1-length),end:f.end,...strategicFinancial(data,{...f,start:shiftDay(f.end,1-length)},today)}));
  const changes=financialRows.map(r=>({...r,value:current[r.key],previous:previous[r.key],variation:variation(current[r.key],previous[r.key])}));
  const delta=current.contribution!==null&&previous.contribution!==null?current.contribution-previous.contribution:null;
  const standout=creatives.filter(r=>r.exact&&r.recurringDays>1&&r.contribution!==null&&r.contribution>0).sort((a,b)=>b.contribution!-a.contribution!)[0];
  const sourceList=(data.manualPeriods??[]).filter(p=>p.start<=f.end&&p.end>=f.start).flatMap(p=>p.sources);
  const sources=[...new Map(sourceList.map(s=>[s.sha256??s.name,s])).values()];
  const revised=(data.analysisRevisions??[]).filter(r=>r.days.some(d=>d>=f.start&&d<=f.end));
  const status=!current.complete?'Parcial':revised.length?'Atualizado · filtros das fontes não confirmados':'Parcial · datas cobertas; filtros das fontes não confirmados';
  const selectedExcluded=scoped.excluded.filter(o=>o.currency===f.currency&&orderDay(o)>=f.start&&orderDay(o)<=f.end);
  const diagnosis=[{kind:'Fato',text:`${data.organization} · ${f.start} a ${f.end}. ${status}. Contribuição total ${money(current.contribution,f.currency)}; ${current.main??'—'} compras principais.`},{kind:'Interpretação',text:delta===null?'Não há período anterior comparável completo para interpretar evolução financeira.':`A contribuição variou ${money(delta,f.currency)} frente ao período anterior de mesmo tamanho. ${delta>=0?'Melhorou a sobra após mídia.':'Reduziu a capacidade de financiar novos testes.'} Receita, volume e margem precisam ser considerados separadamente.`},{kind:'Evolução positiva',text:current.frontGross!==null&&previous.frontGross!==null&&current.frontGross>previous.frontGross?`O bruto principal aumentou ${money(current.frontGross-previous.frontGross,f.currency)}. Verifique se veio de mais pedidos ou de ticket maior.`:'Não há melhora financeira comprovada para destacar neste comparativo; preservar o diagnóstico sem forçar sinal positivo.'},{kind:'Problema',text:`${current.blended??'—'} principais sem correspondência SCK exata demonstrada; ${selectedExcluded.length} itens de produtos externos ou sem vínculo comprovado foram separados. Não distribuir essas vendas entre anúncios.`},{kind:'Criativo de destaque',text:standout?`${standout.name}: ${standout.recurringDays} dias com vendas diretas e contribuição ${money(standout.contribution,f.currency)}. Ainda requer revisão do contexto antes de escala.`:creatives[0]?`Maior concentração de mídia: ${creatives[0].name}, ${money(creatives[0].spend,f.currency)}. Não há evidência SCK suficiente para declarar um vencedor financeiro.`:'Não há anúncios identificados no recorte.'},{kind:'Recomendação',text:'Validar IDs textuais, cobertura de pausados e estrutura dos conjuntos. Preservar PERFORMANCE + LAB em ABO e comparar janelas antes de alterar orçamento. Método Del suspenso.'}];
  return {organization:data.organization,filters:f,today,current,previous,days,changes,creatives,relevant,residual,groups:group('family'),strategies:group('strategy'),windows,projections:projectFinancial(data,f,today,dailyBudget,goal),diagnosis,status,sources,revisions:revised,excluded:selectedExcluded.map(o=>({product:o.product,status:o.status,currency:o.currency})),duplicates:select(data,f).orders.length-new Set(select(data,f).orders.map(o=>o.accountId+'|'+o.transaction+'|'+o.productId)).size};
}
export type StrategicReport=ReturnType<typeof buildStrategicReport>;
