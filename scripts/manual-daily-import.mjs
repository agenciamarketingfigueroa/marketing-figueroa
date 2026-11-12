import {createHash} from 'node:crypto';
import {parseDailyMeta} from './manual-meta.mjs';
const check=(value,message)=>{if(!value)throw Error(message);};
const hash=value=>createHash('sha256').update(value).digest('hex').slice(0,16);
const approved=o=>o.status==='APPROVED'||o.status==='COMPLETE';
const statusMap={'Completo':'COMPLETE','Aprovado':'APPROVED','Reembolsado':'REFUNDED','Cancelado':'CANCELLED','Chargeback':'CHARGEBACK','Aguardando pagamento':'WAITING_PAYMENT','Aguardando Pagto':'WAITING_PAYMENT','Boleto impresso':'PRINTED_BILLET'};
const clean=value=>!value||value==='(none)'?'':String(value).trim();
function cents(value) {
  const match=String(value??'').match(/^(\d+)(?:\.(\d+))?$/);check(match,'Valor Hotmart inválido');
  const fraction=(match[2]??'').padEnd(3,'0');
  const result=Number(BigInt(match[1])*100n+BigInt(fraction.slice(0,2))+(Number(fraction[2])>=5?1n:0n));
  check(Number.isSafeInteger(result),'Valor Hotmart fora do limite');return result;
}
export function parseDailyHotmart(rows,period) {
  const names={transaction:'Código da transação',status:'Status da transação',day:'Data da transação',productId:'Código do produto',product:'Produto',currency:'Moeda de recebimento',gross:'Faturamento bruto (sem impostos)',net:'Faturamento líquido',role:'Venda feita como',sck:'Código SCK',src:'Código SRC',channel:'Canal usado para venda',tool:'Ferramenta de Venda',parent:'Transação do Produto Principal',payment:'Método de pagamento'};
  const columns=new Map(Object.entries(rows[0]??{}).map(([col,name])=>[name,col]));
  for(const name of Object.values(names))check(columns.has(name),'Coluna Hotmart ausente: '+name);
  const seen=new Set();
  return rows.slice(1).map(row=>{
    const get=key=>row[columns.get(names[key])];
    const transaction=get('transaction'),status=statusMap[get('status')],match=String(get('day')).match(/^(\d{2})\/(\d{2})\/(\d{4}) \d{2}:\d{2}:\d{2}$/);
    check(transaction&&!seen.has(transaction)&&status&&match,'Registro Hotmart inválido ou duplicado');seen.add(transaction);
    const day=`${match[3]}-${match[2]}-${match[1]}`;
    check(day>=period.start&&day<=period.end&&new Date(day+'T12:00:00Z').toISOString().slice(0,10)===day,'Data Hotmart fora do período');
    check(['BRL','USD'].includes(get('currency'))&&get('role')==='Produtor'&&get('productId')&&get('product')?.trim(),'Produto, moeda ou papel Hotmart inválido');
    const sck=clean(get('sck')),src=clean(get('src')),channel=clean(get('channel')),tool=clean(get('tool')),parent=clean(get('parent'));
    const category=/^\d{10,}$/.test(sck)?'Código numérico SCK':/HOTMART_SALES_AGENT/i.test(sck)?'Hotmart Sales Agents':/HOTMART_(SITE|PRODUCT_PAGE)|Site da Hotmart|Página de Produto Hotmart/i.test(sck+' '+channel)?'Marketplace Hotmart':sck||src?'Outro código de origem':'Sem código de origem';
    return {transaction:'ref-'+hash(transaction),accountId:'manual-hotmart',productId:String(get('productId')),product:get('product').trim(),offer:null,status,purchasedAt:day+'T12:00:00-03:00',approvedAt:null,currency:get('currency'),gross:cents(get('gross')),net:cents(get('net')),payment:clean(get('payment'))||'Não informado',source:{},manualSourcePresent:Boolean(sck||src),manualSourceCategory:category,manualTool:['Produto order bump','Produto principal','Hotmart Recomenda'].includes(tool)?tool:tool?'Outra ferramenta informada':'Não informada',parentTransaction:parent?'ref-'+hash(parent):null,isBump:tool==='Produto order bump',isFunnel:false};
  });
}
function windows(periods) {
  const result=[];
  for(const p of [...periods].sort((a,b)=>a.start.localeCompare(b.start))) {
    const start=Date.parse(p.start+'T00:00:00-03:00'),end=Date.parse(p.end+'T23:59:59.999-03:00'),last=result.at(-1);
    if(last&&start<=last.end+1)last.end=Math.max(last.end,end);else result.push({start,end});
  }
  return result;
}
function totals() {return {gross:0,net:0,sales:0,brlSales:0,usdGross:0,usdNet:0,usdSales:0};}
export function summary(period,orders,insights,sources) {
  const daily=new Map(),products=new Map(),ads=new Map(),statuses={},payments={};
  for(let day=period.start;day<=period.end;day=new Date(Date.parse(day+'T12:00:00Z')+86400000).toISOString().slice(0,10))daily.set(day,{date:day,...totals()});
  const result={id:period.start,start:period.start,end:period.end,days:daily.size,month:period.month,spend:0,impressions:0,metaPurchases:0,...totals(),sourceSignals:0};
  for(const row of insights) {
    const ad=ads.get(row.ad)??{name:row.ad,spend:0,impressions:0,purchases:0};
    for(const key of ['spend','impressions']){result[key]=result[key]===null||row[key]===null?null:result[key]+row[key];ad[key]=ad[key]===null||row[key]===null?null:ad[key]+row[key];}
    result.metaPurchases=result.metaPurchases===null||row.purchases==null?null:result.metaPurchases+row.purchases;
    ad.purchases=ad.purchases===null||row.purchases==null?null:ad.purchases+row.purchases;
    ads.set(row.ad,ad);
  }
  for(const order of orders) {
    const status=Object.keys(statusMap).find(s=>statusMap[s]===order.status);check(status,'Status histórico desconhecido');statuses[status]=(statuses[status]??0)+1;
    if(!approved(order))continue;
    const product=products.get(order.product)??{name:order.product,...totals()};
    for(const item of [result,product,daily.get(order.purchasedAt.slice(0,10))]) {
      check(item,'Venda fora do período');item.sales++;item[order.currency==='BRL'?'brlSales':'usdSales']++;
      item[order.currency==='BRL'?'gross':'usdGross']+=order.gross;item[order.currency==='BRL'?'net':'usdNet']+=order.net;
    }
    products.set(order.product,product);payments[order.payment]=(payments[order.payment]??0)+1;if(order.manualSourcePresent)result.sourceSignals++;
  }
  return {...result,ads:[...ads.values()],products:[...products.values()],daily:[...daily.values()],statuses,payments,sources};
}
/** All validation completes in memory before the caller seals and replaces the package. */
export function importDailyReport(previous,metaBatches,hotmartBatches) {
  const report=structuredClone(previous),data=report.dataset;
  check(data?.mode==='manual'&&report.periods?.length,'Relatório incompatível');
  const inRange=(day,p)=>day>=p.start&&day<=p.end;
  const periods=report.periods.map(p=>({start:p.start,end:p.end,month:p.month,sources:p.sources}));
  const aggregates=data.manualMetaAggregates??data.insights;
  if(!data.manualMetaDailyCoverage)check(periods.every(p=>metaBatches.some(b=>b.start===p.start&&b.end===p.end)),'Envie todos os períodos históricos para migrar a mídia diária');
  const importedRanges=[];
  for(const batch of metaBatches) {
    check(!importedRanges.some(p=>batch.start<=p.end&&batch.end>=p.start),'Exports Meta sobrepostos');importedRanges.push(batch);
    const old=report.periods.find(p=>p.start===batch.start&&p.end===batch.end);
    check(old||!periods.some(p=>batch.start<=p.end&&batch.end>=p.start),'Export diário sobrepõe parte de um período existente');
    const parsed=parseDailyMeta(batch.rows,batch);
    if(old)check(parsed.totals.spend===old.spend&&parsed.totals.purchases===old.metaPurchases&&parsed.totals.impressions===old.impressions,'Totais Meta divergentes em '+batch.month);
    data.insights=data.insights.filter(r=>!inRange(r.date,batch));data.insights.push(...parsed.insights);
    if(!old){check(hotmartBatches.some(b=>b.start===batch.start&&b.end===batch.end),'Novo período exige Hotmart correspondente');periods.push({start:batch.start,end:batch.end,month:batch.month,sources:[]});}
    const p=periods.find(p=>p.start===batch.start&&p.end===batch.end);p.sources=[batch.source,...p.sources.slice(1)];
  }
  for(const batch of hotmartBatches) {
    const period=periods.find(p=>p.start===batch.start&&p.end===batch.end);check(period,'Hotmart sem período Meta correspondente');
    const imported=parseDailyHotmart(batch.rows,batch),old=data.orders.filter(o=>inRange(o.purchasedAt.slice(0,10),batch));
    if(old.length)check(JSON.stringify(old.map(o=>[o.transaction,o.status,o.currency,o.gross,o.net]).sort())===JSON.stringify(imported.map(o=>[o.transaction,o.status,o.currency,o.gross,o.net]).sort()),'Hotmart existente mudou; reconciliação necessária');
    data.orders=data.orders.filter(o=>!inRange(o.purchasedAt.slice(0,10),batch));data.orders.push(...imported);
    period.sources=[period.sources[0],batch.source];
  }
  check(new Set(data.orders.map(o=>o.accountId+'|'+o.transaction)).size===data.orders.length,'Transação duplicada entre períodos');
  data.insights.sort((a,b)=>a.date.localeCompare(b.date)||a.adId.localeCompare(b.adId));data.orders.sort((a,b)=>a.purchasedAt.localeCompare(b.purchasedAt)||a.transaction.localeCompare(b.transaction));
  data.manualMetaAggregates=aggregates;data.manualMetaAggregateSources??=previous.periods.flatMap(p=>p.sources.filter(s=>s.name.startsWith('Meta (')));
  // Previews use existing names/codes only. This is not transaction attribution.
  const oldCreatives=data.creatives??[],oldRows=[...(previous.dataset.manualMetaAggregates??[]),...previous.dataset.insights];
  const creatives=new Map(oldCreatives.map(c=>[c.accountId+'|'+c.adId,c]));
  const byName=new Map();
  for(const row of oldRows){const creative=creatives.get(row.accountId+'|'+row.adId);if(creative){const matches=byName.get(row.ad)??new Map();matches.set(creative.imageUrl,creative);byName.set(row.ad,matches);}}
  for(const row of data.insights) {
    const key=row.accountId+'|'+row.adId;if(creatives.has(key))continue;
    const candidates=byName.get(row.ad);
    if(candidates?.size===1){const c=candidates.values().next().value;creatives.set(key,{...c,accountId:row.accountId,adId:row.adId,name:row.ad,matchBasis:c.matchBasis+' · prévia vinculada por nome, sem atribuição de vendas'});}
  }
  data.creatives=[...creatives.values()];
  report.periods=periods.sort((a,b)=>a.start.localeCompare(b.start)).map(p=>summary(p,data.orders.filter(o=>inRange(o.purchasedAt.slice(0,10),p)),data.insights.filter(r=>inRange(r.date,p)),p.sources));
  data.manualPeriods=report.periods.map(({start,end,month,sources})=>({start,end,month,sources}));
  data.manualMetaDailyCoverage=windows(report.periods);data.coverage={...data.coverage,meta:windows(report.periods),hotmart:windows(report.periods)};data.manualStatusComplete=true;
  report.coverage.meta='daily';
  return report;
}
