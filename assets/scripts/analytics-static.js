import {bindLogin,session,logout} from './portal-auth.js';

const $=selector=>document.querySelector(selector);
const $$=selector=>[...document.querySelectorAll(selector)];
const esc=value=>String(value).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
const num=value=>value==null?'—':value.toLocaleString('pt-BR',{maximumFractionDigits:0});
const money=(value,currency='BRL')=>value==null?'—':(value/100).toLocaleString('pt-BR',{style:'currency',currency});
const ratio=value=>value==null?'—':value.toLocaleString('pt-BR',{minimumFractionDigits:2,maximumFractionDigits:2})+'x';
const percent=value=>value==null?'—':(value*100).toLocaleString('pt-BR',{minimumFractionDigits:1,maximumFractionDigits:1})+'%';
const divide=(a,b)=>Number.isFinite(a)&&Number.isFinite(b)&&b!==0?a/b:null;
const shortDate=day=>day.slice(8,10)+'/'+day.slice(5,7);
const fullDate=day=>shortDate(day)+'/'+day.slice(0,4);
const decode=value=>Uint8Array.from(atob(value),c=>c.charCodeAt(0));
const storageKey='figueroa-analytics-key-v1';
const sums=['days','spend','impressions','metaPurchases','gross','net','sales','brlSales','usdGross','usdNet','usdSales','sourceSignals'];
const labels={overview:'Visão geral',meta:'Meta Ads',hotmart:'Hotmart',ads:'Anúncios',products:'Produtos',reports:'Relatórios'};
const descriptions={overview:'Mídia, vendas e resultado. Cada número no seu devido lugar.',meta:'Investimento e conversões atribuídas pela plataforma.',hotmart:'Vendas confirmadas, valores e ritmo diário.',ads:'Anúncios ordenados por investimento e compras.',products:'Produtos que compõem a receita.',reports:'Fontes, critérios e arquivos importados.'};
let report,selected,selectedPeriods,activeSession,expiryTimer,section='overview';

function aggregate(periods) {
  const result=Object.fromEntries(sums.map(k=>[k,periods.reduce((total,p)=>total+p[k],0)]));
  result.start=periods[0].start;result.end=periods.at(-1).end;
  result.daily=periods.flatMap(p=>p.daily);result.sources=periods.flatMap(p=>p.sources);
  result.payments={};
  for(const p of periods)for(const [name,count] of Object.entries(p.payments))result.payments[name]=(result.payments[name]||0)+count;
  for(const type of ['ads','products']) {
    const groups=new Map();
    for(const p of periods)for(const row of p[type]) {
      const group=groups.get(row.name)||{name:row.name};
      for(const [key,value] of Object.entries(row))if(typeof value==='number')group[key]=(group[key]||0)+value;
      groups.set(row.name,group);
    }
    result[type]=[...groups.values()];
  }
  return result;
}
function current() {
  const currency=$('#currency-select').value,usd=currency==='USD',s=selected;
  return {currency,usd,gross:usd?s.usdGross:s.gross,net:usd?s.usdNet:s.net,sales:usd?s.usdSales:s.brlSales,spend:usd?null:s.spend,impressions:usd?null:s.impressions,purchases:usd?null:s.metaPurchases,profit:usd?null:s.net-s.spend,mer:usd?null:divide(s.gross,s.spend),cpa:usd?null:divide(s.spend,s.metaPurchases),cpm:usd?null:divide(s.spend*1000,s.impressions),ticket:divide(usd?s.usdGross:s.gross,usd?s.usdSales:s.brlSales)};
}
function previous() {
  const index=report.periods.findIndex(p=>p.id===$('#period-select').value);
  return index>0?report.periods[index-1]:null;
}
function change(key,normalizeDays=false) {
  const p=previous(),c=selectedPeriods[0],usd=$('#currency-select').value==='USD';
  if(!p||selectedPeriods.length!==1)return null;
  const value=x=>key==='profit'?(usd?null:x.net-x.spend):key==='mer'?(usd?null:divide(x.gross,x.spend)):key==='sales'?(usd?x.usdSales:x.brlSales):usd?({gross:x.usdGross,net:x.usdNet}[key]??null):x[key];
  const a=value(c),b=value(p);
  if(a==null||b==null||b===0)return null;
  const actual=normalizeDays?a/c.days:a,prior=normalizeDays?b/p.days:b;
  return (actual-prior)/Math.abs(prior);
}
function changeMarkup(value) {
  if(value==null)return '<span class="delta neutral">—</span><span>Sem comparação disponível</span>';
  return `<span class="delta ${value>=0?'positive':'negative'}">${value>=0?'↗':'↘'} ${percent(Math.abs(value))}</span><span>vs. período anterior</span>`;
}
function kpi(title,value,detail,changeValue,featured=false) {
  return `<article class="kpi${featured?' featured':''}"><div class="kpi-title"><span>${esc(title)}</span><span class="nav-icon">${featured?'◈':'↗'}</span></div><strong class="kpi-value">${esc(value)}</strong><div class="kpi-comparison">${changeMarkup(changeValue)}</div><p>${esc(detail)}</p></article>`;
}
function renderHeadline() {
  const m=current();
  $('#hero-mer').textContent=ratio(m.mer);
  $('#hero-spend').textContent=money(m.spend);
  $('#hero-sales').textContent=num(m.sales);
  $('#hero-gross').textContent=`${money(m.gross,m.currency)} em receita bruta`;
  $('#hero-meta').textContent=num(m.purchases);
  $('#hero-note').textContent=m.usd?'USD separado · gasto Meta em BRL, sem conversão':'ROAS Meta indisponível: o export não traz valor de conversão.';
  $('#section-period').textContent=`${fullDate(selected.start)} a ${fullDate(selected.end)}`;
  $('#kpi-grid').innerHTML=[
    kpi('Receita bruta aprovada',money(m.gross,m.currency),'Hotmart · na moeda de recebimento',change('gross',true),true),
    kpi('Investimento em mídia',money(m.spend),'Meta Ads · gasto em BRL',change('spend',true)),
    kpi('Resultado após mídia',money(m.profit),'Líquido BRL − investimento Meta',change('profit',true)),
    kpi('MER da operação',ratio(m.mer),'Bruto Hotmart BRL ÷ investimento',change('mer'))
  ].join('');
  const secondary=[['Vendas aprovadas',num(m.sales)],['Ticket médio',money(m.ticket,m.currency)],['Líquido apurado',money(m.net,m.currency)],['Compras Meta',num(m.purchases)],['Impressões / CPM',m.impressions==null?'—':`${num(m.impressions)} / ${money(m.cpm)}`]];
  $('#secondary-kpis').innerHTML=secondary.map(([name,value])=>`<div><span>${esc(name)}</span><strong>${esc(value)}</strong></div>`).join('');
  const stages=[['01','Impressões',m.impressions,'CPM',money(m.cpm)],['02','Cliques no link',null,'CPC','—'],['03','Checkouts',null,'Custo por checkout','—'],['04','Compras · Meta',m.purchases,'CPA',money(m.cpa)]];
  $('#funnel-cards').innerHTML=stages.map(([index,name,value,cost,costValue])=>`<article><div class="stage-title"><span>${index}</span><span>◈</span></div><h3>${esc(name)}</h3><strong>${num(value)}</strong><dl><div><dt>${esc(cost)}</dt><dd>${esc(costValue)}</dd></div></dl><small>${value==null?'Não informado no export':'Reportado pela Meta'}</small></article>`).join('');
  $('#coverage-notice').textContent=`Cobertura parcial da operação: apenas Mvave BR, de ${fullDate(report.periods[0].start)} a ${fullDate(report.periods.at(-1).end)}. A Oficina do Violão ainda não enviou relatórios.${selected.usdSales?` Há ${num(selected.usdSales)} vendas em USD fora dos resultados em BRL.`:''} Meta e Hotmart não estão conectadas.`;
  $('#coverage-date').textContent=`${selectedPeriods.length} período${selectedPeriods.length===1?'':'s'} · ${selected.days} dias`;
  $('#footer-range').textContent=`Dados privados · importação manual · ${fullDate(report.periods.at(-1).end)}`;
}
function renderTracking() {
  const signal=selected.sourceSignals,total=selected.sales;
  $('#source-count').textContent=num(signal);
  $('#source-with').textContent=num(signal);
  $('#source-without').textContent=num(total-signal);
  $('#source-track').style.width=`${Math.max(0,Math.min(100,(divide(signal,total)||0)*100))}%`;
}
function plot(values,{mode='line',second=null,labels=[]}={}) {
  const W=650,H=245,left=48,right=12,top=16,bottom=35,base=H-bottom;
  const series=values.map(v=>Number.isFinite(v)?v:null),secondary=second?.map(v=>Number.isFinite(v)?v:null);
  const max=Math.max(1,...series.filter(v=>v!=null),...(secondary||[]).filter(v=>v!=null))*1.12;
  const step=(W-left-right)/Math.max(values.length,1),x=i=>left+step*(i+.5),y=v=>base-v/max*(base-top);
  let svg=`<svg viewBox="0 0 ${W} ${H}" role="img" aria-label="Gráfico do período"><title>${esc(labels.map((label,i)=>`${label}: ${series[i]==null?'indisponível':series[i].toLocaleString('pt-BR',{maximumFractionDigits:2})}`).join('; '))}</title>`;
  for(let i=0;i<4;i++){const v=max*i/3,py=y(v);svg+=`<line class="grid" x1="${left}" x2="${W-right}" y1="${py}" y2="${py}"/><text x="${left-7}" y="${py+4}" text-anchor="end">${num(v)}</text>`;}
  if(mode==='bars')series.forEach((v,i)=>{if(v!=null)svg+=`<rect class="bar" x="${x(i)-step*.28}" y="${y(v)}" width="${Math.max(2,step*.56)}" height="${Math.max(1,base-y(v))}" rx="2"/>`;});
  else {
    const points=series.map((v,i)=>v==null?null:[x(i),y(v)]);
    const path=points.map((p,i)=>p?`${i===0||!points[i-1]?'M':'L'}${p[0]},${p[1]}`:'').join(' ');
    svg+=`<path class="series-a" d="${path}"/>`;
    if(secondary){const other=secondary.map((v,i)=>v==null?null:[x(i),y(v)]);svg+=`<path class="series-b" d="${other.map((p,i)=>p?`${i===0||!other[i-1]?'M':'L'}${p[0]},${p[1]}`:'').join(' ')}"/>`;}
  }
  labels.forEach((label,i)=>{if(i===0||i===labels.length-1||i%Math.max(1,Math.ceil(labels.length/9))===0)svg+=`<text x="${x(i)}" y="${H-10}" text-anchor="middle">${esc(label)}</text>`;});
  return svg+'</svg>';
}
function renderChart() {
  const mode=$('#chart-mode').value,usd=$('#currency-select').value==='USD';
  if(mode==='mer'&&usd){$('#chart-title').textContent='Evolução do MER';$('#chart-caption').textContent='MER indisponível para USD';$('#chart-legend').innerHTML='';$('#history-chart').innerHTML='<p class="empty-copy">O gasto Meta está em BRL. Sem conversão de moeda, não há MER em USD.</p>';return;}
  let values=[],second=null,labels=[],title='',legend='';
  if(mode==='revenue'||mode==='mer') {
    const rows=selectedPeriods;
    labels=rows.map(p=>p.month.includes(' ')?shortDate(p.start):p.month);
    if(mode==='revenue'){values=rows.map(p=>(usd?p.usdGross:p.gross)/100);second=usd?null:rows.map(p=>p.spend/100);title='Receita e investimento';legend=usd?'Receita Hotmart · USD':'Receita Hotmart · BRL|Investimento Meta · BRL';}
    else{values=rows.map(p=>usd?null:divide(p.gross,p.spend));title='Evolução do MER';legend='MER geral';}
  } else {
    labels=selected.daily.map(d=>shortDate(d.date));
    if(mode==='sales'){values=selected.daily.map(d=>usd?d.usdSales:d.brlSales);title='Evolução das vendas';legend='Vendas aprovadas';}
    else{let running=0;values=selected.daily.map(d=>{running+=(usd?d.usdGross:d.gross)/100;return running;});title='Crescimento da operação';legend=`Receita acumulada · ${usd?'USD':'BRL'}`;}
  }
  $('#chart-title').textContent=title;
  $('#chart-caption').textContent=`${fullDate(selected.start)} a ${fullDate(selected.end)} · ${selected.days} dias`;
  $('#chart-legend').innerHTML=legend.split('|').map((name,i)=>`<span><i class="${i?'legend-grey':'legend-orange'}"></i>${esc(name)}</span>`).join('');
  $('#history-chart').innerHTML=plot(values,{mode:mode==='sales'?'bars':'line',second,labels});
}
function renderAds() {
  const term=$('#ad-search').value.trim().toLocaleLowerCase('pt-BR'),sort=$('#ad-sort').value;
  if($('#currency-select').value==='USD'){$('#ads-body').innerHTML='<tr><td colspan="6">Meta Ads está em BRL. Selecione BRL para ver os anúncios.</td></tr>';$('#ads-count').textContent='Dados Meta em BRL';return;}
  const value=ad=>sort==='cpa'?divide(ad.spend,ad.purchases):ad[sort];
  const rows=[...selected.ads].filter(ad=>ad.spend>0&&ad.name.toLocaleLowerCase('pt-BR').includes(term)).sort((a,b)=>{const av=value(a),bv=value(b);return av==null?(bv==null?0:1):bv==null?-1:sort==='cpa'?av-bv:bv-av;});
  $('#ads-body').innerHTML=rows.length?rows.map(ad=>`<tr><td><span class="campaign-name"><span class="campaign-icon">◈</span><span>${esc(ad.name)}</span></span></td><td>${money(ad.spend)}</td><td>${num(ad.impressions)}</td><td>${num(ad.purchases)}</td><td>${money(divide(ad.spend,ad.purchases))}</td><td class="roas-cell">—</td></tr>`).join(''):'<tr><td colspan="6">Nenhum anúncio para esta busca.</td></tr>';
  $('#ads-count').textContent=`${rows.length} anúncios no recorte`;
}
function renderProducts() {
  const usd=$('#currency-select').value==='USD',currency=usd?'USD':'BRL';
  $('#product-currency').textContent=currency;
  const rows=[...selected.products].filter(p=>(usd?p.usdSales:p.brlSales)>0).sort((a,b)=>(usd?b.usdGross:b.gross)-(usd?a.usdGross:a.gross));
  const max=rows.length?(usd?rows[0].usdGross:rows[0].gross):0;
  $('#product-list').innerHTML=rows.length?rows.map((p,i)=>{const revenue=usd?p.usdGross:p.gross,sales=usd?p.usdSales:p.brlSales;return `<div class="product-row"><span class="product-index">${String(i+1).padStart(2,'0')}</span><div class="product-info"><strong>${esc(p.name)}</strong><span>${num(sales)} vendas aprovadas</span><div class="product-track"><i style="width:${max?revenue/max*100:0}%"></i></div></div><strong>${money(revenue,currency)}</strong></div>`;}).join(''):'<p class="empty-copy">Nenhuma venda nesta moeda e período.</p>';
  const payments=Object.entries(selected.payments).sort((a,b)=>b[1]-a[1]),paymentMax=payments[0]?.[1]||1;
  $('#payment-chart').innerHTML=payments.length?payments.map(([name,count])=>`<div class="payment-row"><span title="${esc(name)}">${esc(name)}</span><span class="track"><i style="width:${count/paymentMax*100}%"></i></span><strong>${num(count)}</strong></div>`).join(''):'<p class="empty-copy">Sem vendas no período.</p>';
}
function renderSources() {
  $('#source-list').innerHTML=selected.sources.map(source=>`<li>${esc(source.name)} · ${num(source.rows)} registros</li>`).join('');
}
function csv() {
  const currency=$('#currency-select').value,rows=selectedPeriods;
  const fields=[['periodo',p=>`${p.start} a ${p.end}`],['dias',p=>p.days],['gasto_meta_BRL',p=>(p.spend/100).toFixed(2)],['bruto_hotmart_BRL',p=>(p.gross/100).toFixed(2)],['liquido_hotmart_BRL',p=>(p.net/100).toFixed(2)],['vendas_BRL',p=>p.brlSales],['bruto_hotmart_USD',p=>(p.usdGross/100).toFixed(2)],['liquido_hotmart_USD',p=>(p.usdNet/100).toFixed(2)],['vendas_USD',p=>p.usdSales],['compras_meta',p=>p.metaPurchases]];
  const quote=value=>'"'+String(value).replaceAll('"','""')+'"';
  const content='\uFEFF'+[fields.map(([name])=>quote(name)).join(';'),...rows.map(p=>fields.map(([,get])=>quote(get(p))).join(';'))].join('\r\n');
  const url=URL.createObjectURL(new Blob([content],{type:'text/csv;charset=utf-8'})),link=document.createElement('a');
  link.href=url;link.download=`analytics-${currency}-${selected.start}-${selected.end}.csv`;link.click();setTimeout(()=>URL.revokeObjectURL(url),1000);
}
function setSection(next) {
  section=next;$('#breadcrumb-section').textContent=labels[next];$('#page-title').innerHTML=`${esc(next==='overview'?'Sua operação, em perspectiva.':labels[next])}<span class="orange-dot">.</span>`;$('#page-description').textContent=descriptions[next];
  $$('.sidebar nav [data-section]').forEach(button=>{button.classList.toggle('active',button.dataset.section===next);button.setAttribute('aria-current',button.dataset.section===next?'page':'false');button.querySelector('.nav-dot')?.remove();if(button.dataset.section===next)button.insertAdjacentHTML('beforeend','<span class="nav-dot"></span>');});
  const visible={overview:['return-hero','media-panel','kpi-grid','secondary-kpis','charts','ads-panel','bottom-grid','method'],meta:['return-hero','media-panel','kpi-grid','secondary-kpis','charts','ads-panel'],hotmart:['kpi-grid','secondary-kpis','charts','bottom-grid'],ads:['ads-panel'],products:['bottom-grid'],reports:['method']}[next];
  for(const id of ['return-hero','media-panel','kpi-grid','secondary-kpis','charts','ads-panel','bottom-grid','method'])$(id==='charts'?'#charts-grid':'#'+id).hidden=!visible.includes(id);
  $('.section-caption').hidden=!visible.includes('kpi-grid');
  $('#sidebar').classList.remove('open');$('#sidebar-backdrop').hidden=true;$('#mobile-toggle').setAttribute('aria-expanded','false');
  window.scrollTo({top:0,behavior:'instant'});
}
function render() {
  const id=$('#period-select').value;
  selectedPeriods=id==='all'?report.periods:report.periods.filter(p=>p.id===id);
  selected=aggregate(selectedPeriods);
  $$('#period-presets [data-period]').forEach(button=>button.classList.toggle('selected',button.dataset.period===id));
  renderHeadline();renderTracking();renderChart();renderAds();renderProducts();renderSources();setSection(section);
}
async function unlock(passphrase) {
  const response=await fetch(new URL('assets/reports/manual-analytics.enc.json',document.baseURI),{cache:'no-store'});
  if(!response.ok)throw Error('network');
  const sealed=await response.json();
  if(sealed.version!==1||sealed.kdf!=='PBKDF2-SHA256')throw Error('format');
  const material=await crypto.subtle.importKey('raw',new TextEncoder().encode(passphrase),'PBKDF2',false,['deriveKey']);
  const key=await crypto.subtle.deriveKey({name:'PBKDF2',salt:decode(sealed.salt),iterations:sealed.iterations,hash:'SHA-256'},material,{name:'AES-GCM',length:256},false,['decrypt']);
  let data;
  try{data=JSON.parse(new TextDecoder().decode(await crypto.subtle.decrypt({name:'AES-GCM',iv:decode(sealed.iv)},key,decode(sealed.data))));}
  catch{throw Error('key');}
  if(data.schemaVersion!==1||data.mode!=='manual'||data.client?.id!=='mvave-br'||!Array.isArray(data.periods)||!data.periods.length)throw Error('format');
  report=data;sessionStorage.setItem(storageKey,passphrase);
  $('#period-select').innerHTML='<option value="all">Todo o período</option>'+report.periods.map(p=>`<option value="${esc(p.id)}">${esc(p.month)} · ${p.start.slice(0,4)}</option>`).join('');
  $('#period-presets').innerHTML='<button type="button" data-period="all">Todo o período</button>'+report.periods.map(p=>`<button type="button" data-period="${esc(p.id)}">${esc(p.month)}</button>`).join('');
  render();$('#data-key').value='';$('#key-gate').hidden=true;$('#dashboard').hidden=false;
}
async function open(active) {
  if(active.role!=='master')throw Error('role');
  activeSession=active;$('#access-gate').hidden=true;$('#key-gate').hidden=false;
  clearTimeout(expiryTimer);expiryTimer=setTimeout(logout,Math.max(0,active.expires-Date.now()));
  const saved=sessionStorage.getItem(storageKey);
  if(saved)try{await unlock(saved);}catch{sessionStorage.removeItem(storageKey);}
}
bindLogin(open,{requiredRole:'master'});
if(session())open(session()).catch(()=>logout());
$('#key-form').addEventListener('submit',async event=>{
  event.preventDefault();const button=event.currentTarget.querySelector('button');button.disabled=true;$('#key-feedback').textContent='Abrindo dados…';
  try{await unlock($('#data-key').value);$('#key-feedback').textContent='';}
  catch(error){$('#key-feedback').textContent=error.message==='key'?'Chave incorreta. Confira e tente novamente.':'Não foi possível abrir os dados. Verifique a conexão e o arquivo publicado.';}
  finally{button.disabled=false;}
});
$$('[data-section]').forEach(button=>button.addEventListener('click',event=>{event.preventDefault();setSection(button.dataset.section);}));
$('#period-select').addEventListener('change',render);
$('#currency-select').addEventListener('change',render);
$('#period-presets').addEventListener('click',event=>{const button=event.target.closest('[data-period]');if(button){$('#period-select').value=button.dataset.period;render();}});
$('#chart-mode').addEventListener('change',renderChart);
$('#ad-search').addEventListener('input',renderAds);
$('#ad-sort').addEventListener('change',renderAds);
$('#export-csv').addEventListener('click',csv);
$('#mobile-toggle').addEventListener('click',()=>{$('#sidebar').classList.add('open');$('#sidebar-backdrop').hidden=false;$('#mobile-toggle').setAttribute('aria-expanded','true');});
for(const selector of ['#mobile-close','#sidebar-backdrop'])$(selector).addEventListener('click',()=>{$('#sidebar').classList.remove('open');$('#sidebar-backdrop').hidden=true;$('#mobile-toggle').setAttribute('aria-expanded','false');});
window.addEventListener('pageshow',()=>{if(activeSession&&!session())logout();});
