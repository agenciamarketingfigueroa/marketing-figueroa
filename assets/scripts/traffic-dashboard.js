import {bindLogin,session,reportData,logout} from './portal-auth.js';
import {aggregate,metrics,divide} from './traffic-metrics.js';
const $ = selector => document.querySelector(selector);
const escape = value => String(value).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const number = value => value == null ? '—' : value.toLocaleString('pt-BR',{maximumFractionDigits:0});
const decimal = value => value == null ? '—' : value.toLocaleString('pt-BR',{minimumFractionDigits:2,maximumFractionDigits:2});
const money = (cents,currency='BRL') => cents == null ? '—' : (cents/100).toLocaleString('pt-BR',{style:'currency',currency});
const percent = value => value == null ? '—' : decimal(value*100)+'%';
const ratio = value => value == null ? '—' : decimal(value)+'x';
const date = value => value.slice(8,10)+'/'+value.slice(5,7);
const period = week => `${date(week.start)} a ${date(week.end)}`;
let report, selected, activeSession, expiryTimer;

function delta(value,previous,normalizeDays=false) {
  if (!previous) return 'Primeiro período da operação';
  const prior = normalizeDays ? previous.value/previous.days : previous.value;
  const current = normalizeDays ? value/selected.days : value;
  if (!prior) return 'Sem base de comparação anterior';
  const change=(current-prior)/Math.abs(prior);
  return `${change>=0?'+':''}${percent(change)} ${normalizeDays?'na média diária':'vs. período anterior'}`;
}
function cards() {
  const index=report.weeks.findIndex(w=>w.id===$('#report-period').value);
  const previous=index>0?metrics(report.weeks[index-1]):null;
  const all=$('#report-period').value==='all';
  const fields=[
    ['Lucro após mídia','profit',money,'Líquido Hotmart − anúncios · BRL',true],
    ['Valor gasto','spend',money,'Investimento total no Meta Ads',false],
    ['ROAS geral · BRL','roas',ratio,'Bruto Hotmart em BRL ÷ anúncios',false],
    ['Valor bruto · BRL','gross',money,'Faturamento Hotmart antes das deduções',false]
  ];
  $('#main-metrics').innerHTML=fields.map(([label,key,format,description,highlight])=>`<article class="metric ${highlight?'metric-highlight':''} ${highlight&&selected.profit<0?'negative-result':''}"><div class="metric-label">${label}<span aria-hidden="true">${key==='profit'?'↗':key==='roas'?'◎':'◈'}</span></div><strong data-value="${key}">${format(selected[key])}</strong><span class="metric-detail">${description}</span><span class="metric-change">${all?`${selected.days} dias de operação · ${report.weeks.length} períodos`:delta(selected[key],previous?{value:previous[key],days:previous.days}:null,key!=='roas')}</span></article>`).join('');
  const secondary=[['Vendas Hotmart',number(selected.sales),`${number(selected.brlSales)} em BRL${selected.usdSales?` + ${selected.usdSales} em USD`:''} · transações`],['Líquido Hotmart · BRL',money(selected.net),'Receita após deduções do export'],['Ticket médio · BRL',money(selected.ticket),'Bruto BRL ÷ transações em BRL'],['CPA Meta',money(selected.cpa),'Investimento ÷ compras atribuídas pelo Meta']];
  $('#secondary-metrics').innerHTML=secondary.map(([label,value,note])=>`<article><span>${label}</span><strong>${value}</strong><small>${note}</small></article>`).join('');
}

// Accessible SVG charts: native titles provide exact values; tables expose weekly totals.
function trend() {
  const mode=$('#chart-mode').value;
  const series=mode==='money'?[{key:'gross',label:'Bruto BRL',color:'#fc8425'},{key:'spend',label:'Anúncios',color:'#a2b98b'}]:[{key:mode==='profit'?'profit':'roas',label:mode==='profit'?'Lucro após mídia':'ROAS geral',color:'#fc8425'}];
  const weeks=report.weeks.map(metrics);
  const format=mode==='roas'?ratio:money;
  const values=weeks.flatMap(w=>series.map(s=>w[s.key]??0));
  const min=Math.min(0,...values),max=Math.max(1,...values)*1.18;
  const W=620,H=285,left=57,right=10,top=14,bottom=45,plot=H-top-bottom;
  const y=v=>top+(max-v)/(max-min)*plot;
  const step=(W-left-right)/weeks.length;
  let svg=`<svg viewBox="0 0 ${W} ${H}" role="img" aria-label="${escape(series.map(s=>s.label).join(' e '))} por semana"><title>${escape(weeks.map(w=>period(w)+': '+series.map(s=>s.label+' '+format(w[s.key])).join(', ')).join('; '))}</title>`;
  for(let i=0;i<=4;i++) {
    const v=min+(max-min)*i/4;
    svg+=`<line class="axis-line" x1="${left}" y1="${y(v)}" x2="${W-right}" y2="${y(v)}"/><text x="${left-8}" y="${y(v)+4}" text-anchor="end">${mode==='roas'?decimal(v)+'x':number(v/100)}</text>`;
  }
  weeks.forEach((w,i)=>{
    const x=left+step*(i+.5),isSelected=$('#report-period').value===w.id;
    if(isSelected) svg+=`<rect x="${x-step/2+3}" y="0" width="${step-6}" height="${H-15}" fill="#fc730611" rx="6"/>`;
    series.forEach((s,j)=>{
      const v=w[s.key]??0,bw=series.length===2?22:34,bx=x+(j-(series.length-1)/2)*(bw+4)-bw/2;
      svg+=`<rect x="${bx}" y="${Math.min(y(v),y(0))}" width="${bw}" height="${Math.max(Math.abs(y(v)-y(0)),1)}" fill="${v<0?'#e99a81':s.color}" rx="3"><title>${escape(period(w)+': '+s.label+' '+format(v))}</title></rect>`;
    });
    svg+=`<text x="${x}" y="${H-23}" text-anchor="middle">${date(w.start)}</text><text x="${x}" y="${H-8}" text-anchor="middle">${w.days} dias</text>`;
  });
  svg+=`<line x1="${left}" y1="${y(0)}" x2="${W-right}" y2="${y(0)}" stroke="#6d775c"/></svg>`;
  $('#trend-chart').innerHTML=svg;
  $('#trend-legend').innerHTML=series.map(s=>`<i style="background:${s.color}"></i>${s.label}`).join(' &nbsp; ');
}
function composition() {
  const t=selected;
  const positive=t.profit>=0&&t.gross>0;
  const deductions=divide(t.deductions,t.gross)*100;
  const spend=divide(t.spend,t.gross)*100;
  const rows=[['Deduções Hotmart',t.deductions,'#6d7957'],['Investimento em anúncios',t.spend,'#a2b98b'],['Lucro após mídia',t.profit,t.profit<0?'#e99a81':'#fc8425']];
  $('#finance-chart').innerHTML=`<div class="donut-layout"><div class="donut" style="background:${positive?`conic-gradient(#6d7957 0 ${deductions}%,#a2b98b ${deductions}% ${deductions+spend}%,#fc8425 ${deductions+spend}% 100%)`:'#45422d'}" role="img" aria-label="Margem após mídia ${percent(t.margin)}"><div class="donut-center"><strong>${percent(t.margin)}</strong><span>margem após mídia</span></div></div></div>${rows.map(([label,v,color])=>`<div class="money-row"><span><i style="background:${color}"></i>${label}</span><strong>${money(v)}</strong></div>`).join('')}${!positive?'<p class="small-note">O líquido não cobriu todo o investimento neste período.</p>':''}`;
}
const productLabel = name => name.replace(' (Acesso Vitalício por tempo limitado)','').replace('Pack de IRs para ','Pack ');
function products() {
  const sorted=[...selected.products].sort((a,b)=>b.gross-a.gross);
  $('#product-chart').innerHTML=sorted.map(p=>`<div class="product-row"><div class="product-caption"><span title="${escape(p.name)}">${escape(productLabel(p.name))}</span><strong>${money(p.gross)}</strong></div><div class="track"><i style="width:${(divide(p.gross,selected.gross)||0)*100}%"></i></div><small>${number(p.brlSales)} vendas BRL · ${percent(divide(p.gross,selected.gross))} do bruto BRL${p.usdSales?` · + ${money(p.usdGross,'USD')} em ${p.usdSales} vendas`:''}</small></div>`).join('');
}
function funnel() {
  const steps=[['Cliques no link',selected.clicks],['Visitas à página',selected.views],['Checkouts iniciados',selected.checkouts],['Compras Meta',selected.purchases]];
  $('#funnel-chart').innerHTML=steps.map(([label,v],i)=>`<div class="funnel-step" style="width:${100-i*9}%"><span>${label}</span><strong>${number(v)}</strong></div>${i?`<p class="funnel-caption">${percent(divide(v,steps[i-1][1]))} da etapa anterior</p>`:''}`).join('');
  $('#funnel-rates').innerHTML=[['Custo por clique',money(selected.cpc)],['Visita → compra',percent(selected.conversion)],['ROAS Meta',ratio(selected.metaRoas)]].map(([label,v])=>`<div><span>${label}</span><strong>${v}</strong></div>`).join('');
}
function daily() {
  const values=selected.daily,W=1040,H=185,left=46,right=10,top=25,bottom=30;
  const max=Math.max(1,...values.map(d=>d.gross))*1.15,step=(W-left-right)/values.length;
  const y=v=>top+(1-v/max)*(H-top-bottom);
  let svg=`<svg viewBox="0 0 ${W} ${H}" role="img" aria-label="Faturamento bruto diário em BRL"><title>${escape(values.map(d=>date(d.date)+': '+money(d.gross)).join('; '))}</title>`;
  for(let i=0;i<4;i++){const v=max*i/3;svg+=`<line class="axis-line" x1="${left}" y1="${y(v)}" x2="${W}" y2="${y(v)}"/><text text-anchor="end" x="${left-6}" y="${y(v)+4}">${number(v/100)}</text>`;}
  values.forEach((d,i)=>{
    const x=left+step*i+step*.17;
    svg+=`<rect x="${x}" y="${y(d.gross)}" width="${step*.66}" height="${Math.max(y(0)-y(d.gross),1)}" fill="#b96f32" rx="2"><title>${escape(date(d.date)+': '+money(d.gross)+', '+d.sales+' vendas'+(d.usdSales?', mais '+money(d.usdGross,'USD'):''))}</title></rect>`;
    if(values.length<=7||i%5===0||i===values.length-1)svg+=`<text text-anchor="middle" x="${left+step*(i+.5)}" y="${H-8}">${date(d.date)}</text>`;
    if(values.length<=7)svg+=`<text class="chart-value" text-anchor="middle" x="${left+step*(i+.5)}" y="${y(d.gross)-8}">${money(d.gross)}</text>`;
  });
  $('#daily-chart').innerHTML=svg+'</svg>';
}
function ads() {
  const sort=$('#ad-sort').value;
  const value=ad=>sort==='roas'?(divide(ad.metaRevenue,ad.spend)||0):ad[sort];
  $('#ads-body').innerHTML=[...selected.ads].filter(a=>a.spend>0).sort((a,b)=>value(b)-value(a)).map(a=>`<tr><th scope="row">${escape(a.name)}</th><td>${money(a.spend)}</td><td>${number(a.clicks)}</td><td>${number(a.purchases)}</td><td>${money(divide(a.spend,a.purchases))}</td><td>${money(a.metaRevenue)}</td><td>${ratio(divide(a.metaRevenue,a.spend))}</td></tr>`).join('');
}
function history() {
  const row=(w,label,button=false)=>`<tr class="${$('#report-period').value===w.id?'selected':''}"><th scope="row">${button?`<button data-week="${w.id}">${label} ↗</button>`:label}</th><td>${money(w.spend)}</td><td>${money(w.gross)}</td><td>${money(w.net)}</td><td class="${w.profit<0?'negative':'positive'}">${money(w.profit)}</td><td>${ratio(w.roas)}</td><td>${number(w.sales)}</td></tr>`;
  $('#history-body').innerHTML=report.weeks.map(w=>row(metrics(w),`${period(w)}${w.days===3?' · 3 dias':''}`,true)).join('');
  $('#history-total').innerHTML=row(aggregate(report.weeks),'Acumulado');
  document.querySelectorAll('[data-week]').forEach(button=>button.addEventListener('click',()=>{ $('#report-period').value=button.dataset.week;render();$('#report-period').focus();$('#report-main').scrollIntoView({behavior:matchMedia('(prefers-reduced-motion: reduce)').matches?'instant':'smooth'}); }));
}
function insights() {
  const t=selected;
  $('#insight-title').textContent=t.profit>=0?'Receita acima do investimento.':'O líquido ainda não cobre a mídia.';
  $('#insight-body').textContent=`No período, ${number(t.sales)} transações na Hotmart geraram ${money(t.gross)} brutos em BRL. Após as deduções e ${money(t.spend)} em anúncios, o resultado em reais foi ${money(t.profit)}, com margem de ${percent(t.margin)}.${t.usdSales?` Há ainda ${money(t.usdNet,'USD')} líquidos separados deste resultado.`:''}`;
  const index=report.weeks.findIndex(w=>w.id===$('#report-period').value);
  const last=metrics(index<0?report.weeks.at(-1):report.weeks[index]);
  const prev=index===0?null:metrics(index<0?report.weeks.at(-2):report.weeks[index-1]);
  if(prev&&last.roas<prev.roas) {
    $('#attention-title').textContent='O retorno recuou no último período.';
    $('#attention-body').textContent=`De ${period(prev)} para ${period(last)}, o ROAS geral passou de ${ratio(prev.roas)} para ${ratio(last.roas)}. Revise os anúncios com maior gasto e menor retorno Meta e a participação de cada produto antes de ampliar o orçamento. A receita Hotmart não está atribuída individualmente aos anúncios.`;
  } else {
    $('#attention-title').textContent='Acompanhe qualidade e atribuição.';
    $('#attention-body').textContent=`O Meta reporta ${number(t.purchases)} compras, enquanto a Hotmart registra ${number(t.sales)} transações. Essa diferença não comprova falha de rastreamento: origens, janelas de atribuição e compras adicionais podem diferir. Use o detalhamento dos anúncios para orientar os próximos testes.`;
  }
}
function render() {
  const id=$('#report-period').value;
  selected=aggregate(id==='all'?report.weeks:report.weeks.filter(w=>w.id===id));
  $('#period-caption').textContent=`${period(selected)}/2026 · ${selected.days} dias · ${id==='all'?'visão acumulada':'visão semanal'}`;
  $('#currency-note').textContent=selected.usdSales?`Valores principais em BRL. Há mais ${money(selected.usdGross,'USD')} brutos e ${money(selected.usdNet,'USD')} líquidos em ${selected.usdSales} vendas USD, sem conversão para reais. O resultado em BRL é parcial.`:'Valores em BRL · Vendas confirmadas na Hotmart e investimento reportado pelo Meta Ads.';
  cards();trend();composition();products();funnel();daily();ads();history();insights();
  $('#filter-status').textContent=`Relatório atualizado: ${period(selected)}, lucro após mídia ${money(selected.profit)}.`;
}
function csv() {
  const fields=[['periodo',w=>period(w)],['dias',w=>w.days],['gasto_BRL',w=>decimal(w.spend/100)],['bruto_BRL',w=>decimal(w.gross/100)],['liquido_BRL',w=>decimal(w.net/100)],['lucro_apos_midia_BRL',w=>decimal(w.profit/100)],['roas_geral_BRL',w=>decimal(w.roas)],['vendas_hotmart',w=>w.sales],['bruto_USD_separado',w=>decimal(w.usdGross/100)],['liquido_USD_separado',w=>decimal(w.usdNet/100)],['compras_meta',w=>w.purchases],['valor_conversao_meta_BRL',w=>decimal(w.metaRevenue/100)],['roas_meta',w=>decimal(w.metaRoas)]];
  const weeks=$('#report-period').value==='all'?report.weeks:report.weeks.filter(w=>w.id===$('#report-period').value);
  const quote=v=>'"'+String(v).replaceAll('"','""')+'"';
  const lines=[fields.map(([name])=>quote(name)).join(';'),...weeks.map(metrics).map(w=>fields.map(([,get])=>quote(get(w))).join(';'))];
  const url=URL.createObjectURL(new Blob(['\uFEFF'+lines.join('\r\n')],{type:'text/csv;charset=utf-8'}));
  const link=document.createElement('a');link.href=url;link.download=`mvave-br-${selected.start}-${selected.end}.csv`;link.click();setTimeout(()=>URL.revokeObjectURL(url),1000);
}
async function open(active) {
  activeSession=active;
  report=await reportData(active);
  $('#report-period').innerHTML=`<option value="all">Todo o período · ${date(report.weeks[0].start)} a ${date(report.weeks.at(-1).end)}/2026</option>`+report.weeks.map(w=>`<option value="${w.id}">${period(w)}/2026${w.days===3?' · início (3 dias)':''}</option>`).reverse().join('');
  $('#source-list').innerHTML=report.weeks.flatMap(w=>w.sources).map(s=>`<li>${escape(s.name)} · ${s.rows} registros</li>`).join('');
  $('#source-count').textContent=report.weeks.flatMap(w=>w.sources).length;
  document.querySelectorAll('[data-master-link]').forEach(el=>el.hidden=active.role!=='master');
  render();$('#access-gate').hidden=true;$('#dashboard').hidden=false;
  clearTimeout(expiryTimer);expiryTimer=setTimeout(logout,Math.max(0,active.expires-Date.now()));
}
$('#report-period').addEventListener('change',render);
$('#chart-mode').addEventListener('change',trend);
$('#ad-sort').addEventListener('change',ads);
$('#export-csv').addEventListener('click',csv);
$('#print-report').addEventListener('click',()=>window.print());
bindLogin(open);
if(session())open(session()).catch(()=>{$('[data-login-feedback]').textContent='Sua sessão não pôde ser restaurada. Entre novamente.';});
window.addEventListener('pageshow',()=>{if(activeSession&&!session())logout();});
