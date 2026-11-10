import {createHash} from 'node:crypto';
import {readFileSync} from 'node:fs';
import {spawnSync} from 'node:child_process';
import {resolve,extname} from 'node:path';
export const hash=x=>createHash('sha256').update(x).digest('hex');
export const approved=o=>['APPROVED','COMPLETE'].includes(o.status);
export const check=(x,m)=>{if(!x)throw Error(m);};
export const clean=x=>!x||x==='(none)'?'':String(x).trim();
export function mergeCoverageWindows(windows) {
  const merged=[];
  for(const window of [...windows].sort((a,b)=>a.start-b.start)){
    check(Number.isFinite(window.start)&&Number.isFinite(window.end)&&window.end>=window.start,'Cobertura inválida');
    const last=merged.at(-1);
    if(last&&window.start<=last.end+1)last.end=Math.max(last.end,window.end);
    else merged.push({...window});
  }
  return merged;
}
export function cents(x) {
  if(x===undefined||x==='')return null;
  let s=String(x).trim().replace(/\s|R\$/g,'');if(s.includes(','))s=s.replaceAll('.','').replace(',','.');
  check(/^-?\d+(\.\d+)?$/.test(s),'Valor monetário inválido');
  const negative=s.startsWith('-');const [a,b='']=s.replace('-','').split('.');
  check(!b.slice(2).replace(/0/g,''),'Precisão monetária superior a centavos: revisar');
  const n=Number(BigInt(a)*100n+BigInt(b.slice(0,2).padEnd(2,'0')))*(negative?-1:1);check(Number.isSafeInteger(n),'Valor fora do limite');return n;
}
export function csvRows(text) {
  const delimiter=text.split(/\r?\n/)[0].includes(';')?';':',';const rows=[];let row=[],cell='',quoted=false;
  for(let i=0;i<text.length;i++){const c=text[i];if(c==='"'){if(quoted&&text[i+1]==='"'){cell+='"';i++;}else quoted=!quoted;}else if(c===delimiter&&!quoted){row.push(cell);cell='';}else if(c==='\n'&&!quoted){row.push(cell.replace(/\r$/,''));rows.push(row);row=[];cell='';}else cell+=c;}
  check(!quoted,'CSV com aspas não fechadas');if(cell||row.length){row.push(cell.replace(/\r$/,''));rows.push(row);}
  return rows.filter(r=>r.some(Boolean)).map(r=>Object.fromEntries(r.flatMap((v,i)=>[['c'+i,v.replace(/^\uFEFF/,'')],['c'+i+'__type','s']])));
}
export function readRows(path) {
  const raw=readFileSync(path);if(extname(path).toLowerCase()==='.csv')return csvRows(raw.toString('utf8'));
  let r;if(raw.subarray(0,2).toString()==='PK')r=spawnSync('powershell.exe',['-NoProfile','-ExecutionPolicy','Bypass','-File',resolve('scripts/xlsx-rows.ps1'),resolve(path),'-IncludeTypes'],{encoding:'utf8',maxBuffer:80e6});
  else if(raw.subarray(0,4).toString('hex')==='d0cf11e0')r=spawnSync(process.env.MVAVE_PYTHON||'python',['analise-mvave-br/scripts/read-xls.py',path],{encoding:'utf8',maxBuffer:80e6});
  else throw Error('Formato não suportado: esperado CSV, OOXML ou XLS BIFF');
  check(r.status===0,'Leitura falhou. XLS BIFF requer Python + xlrd 2.0.2 (MVAVE_PYTHON); XLSX requer PowerShell. '+(r.error?.message??''));return JSON.parse(r.stdout);
}
export function records(rows){const header=rows[0];check(header,'Arquivo vazio');return rows.slice(1).map((r,i)=>({...Object.fromEntries(Object.entries(header).filter(([k])=>!k.endsWith('__type')).flatMap(([k,v])=>[[v,r[k]??''],[v+'__type',r[k+'__type']??'']])),line:i+2}));}
export function parseInstagram(raw,source){
  const text=(Buffer.isBuffer(raw)?raw.toString(raw[0]===0xff&&raw[1]===0xfe?'utf16le':'utf8'):raw).replace(/^\uFEFF/,'');
  const lines=text.split(/\r?\n/).filter(Boolean);
  // An empty platform export has no date or metric evidence, including no zero.
  if(lines.length===1&&lines[0]==='sep=,')return [];
  const fields={'"Visualizações"':'views','"Interações com o conteúdo"':'interactions','"Seguidores no Instagram"':'followers'};
  check(lines[0]==='sep=,'&&lines[2]==='"Data","Primary"'&&fields[lines[1]],'Formato Instagram não reconhecido');
  const seen=new Set();return lines.slice(3).map((line,i)=>{const m=line.match(/^"(\d{4}-\d\d-\d\d)T00:00:00","(\d+)"$/);check(m,'Linha Instagram inválida');const date=day(m[1]),value=Number(m[2]);check(Number.isSafeInteger(value)&&!seen.has(date),'Valor ou data Instagram inválido/duplicado');seen.add(date);return {date,field:fields[lines[1]],value,source,line:i+4};});
}
export function mergeInstagram(previous,records){
  const days=new Map(previous.map(r=>[r.date,{...r}])),seen=new Map();
  for(const r of records){
    check(['views','followers','interactions'].includes(r.field),'Métrica Instagram inválida');
    check(Number.isSafeInteger(r.value)&&r.value>=0,'Valor Instagram inválido');
    const key=r.date+'|'+r.field;
    if(seen.has(key))check(seen.get(key)===r.value,'Exports Instagram conflitantes para '+key);
    seen.set(key,r.value);const row=days.get(r.date)??{date:r.date};row[r.field]=r.value;days.set(r.date,row);
  }
  for(const row of days.values())for(const field of ['views','followers','interactions']){
    if(row[field]===undefined)row[field]=null;
    check(row[field]===null||Number.isSafeInteger(row[field])&&row[field]>=0,'Valor Instagram inválido: '+row.date+' / '+field);
  }
  return [...days.values()].sort((a,b)=>a.date.localeCompare(b.date));
}
export function classifyLinkedAdditions(base,products){
  const principals=new Set(base.orders.filter(o=>o.operation==='mvave-br'&&o.category==='principal').map(o=>o.transaction));
  return {...base,orders:base.orders.map(o=>{
    if(!['bump','upgrade'].includes(o.category))return o;
    const registered=products[o.item];const valid=registered?.name===o.product&&o.currency==='BRL'&&o.country==='Brasil'&&(registered.category==='principal'||o.parent&&principals.has(o.parent));
    return {...o,operation:valid?'mvave-br':'REVISAR'};
  })};
}
export function day(value){let s=clean(value);if(/^\d{2}\/\d{2}\/\d{4}/.test(s)){const [d,m,y]=s.slice(0,10).split('/');s=`${y}-${m}-${d}`;}else s=s.slice(0,10);check(/^\d{4}-\d{2}-\d{2}$/.test(s)&&new Date(s+'T12:00:00Z').toISOString().slice(0,10)===s,'Data inválida');return s;}
const statusMap={'Aprovado':'APPROVED','Completo':'COMPLETE','Aguardando Pagto':'WAITING_PAYMENT','Aguardando pagamento':'WAITING_PAYMENT','Cancelado':'CANCELLED','Reembolsado':'REFUNDED','Chargeback':'CHARGEBACK','Boleto impresso':'PRINTED_BILLET'};
export function parseHotmart(rows,products,source) {
  for(const name of ['Código do produto','Código da transação','Moeda de recebimento','País','Produto','Venda feita como','Status da transação','Data da transação','Faturamento bruto (sem impostos)','Faturamento líquido'])check(Object.values(rows[0]??{}).includes(name),'Coluna Hotmart ausente: '+name);
  return records(rows).map(r=>{
    const id=clean(r['Código do produto']),tx=clean(r['Código da transação']);check(tx&&id,'Transação/produto ausente');
    const currency=clean(r['Moeda de recebimento']),country=clean(r['País']);check(/^[A-Z]{3}$/.test(currency),'Moeda ausente');
    check(cents(r['Faturamento bruto (sem impostos)'])!==null&&cents(r['Faturamento líquido'])!==null,'Receita ausente; revisar export Hotmart');
    const product=products[id];const name=clean(r.Produto);const parent=clean(r['Transação do Produto Principal']);
    const tool=clean(r['Ferramenta de Venda']);const category=tool==='Produto order bump'?'bump':/upgrade|upsell|funil/i.test(tool)?'upgrade':product?.category==='principal'&&!parent?'principal':'REVISAR';
    const operation=product&&product.name===name&&currency==='BRL'&&country==='Brasil'&&(!product.requiresParent||parent)?'mvave-br':'REVISAR';
    const buyer=clean(r['Email do(a) Comprador(a)']).toLowerCase();const status=statusMap[r['Status da transação']]??'REVISAR';
    check(r['Venda feita como']==='Produtor','Papel de venda não suportado');
    return {key:hash(tx+'|'+id),transaction:tx,item:id,product:name,day:day(r['Data da transação']),currency,country,operation,category,additionalKind:/upgrade/i.test(tool)?'upgrade':/upsell/i.test(tool)?'upsell':null,status,rawStatus:r['Status da transação'],gross:cents(r['Faturamento bruto (sem impostos)']),net:cents(r['Faturamento líquido']),buyer:buyer?hash(buyer):null,parent:parent||null,sck:clean(r['Código SCK']),payment:clean(r['Método de pagamento'])||'Não informado',manualTool:['Produto order bump','Produto principal','Hotmart Recomenda'].includes(tool)?tool:tool?'Outra ferramenta informada':'Não informada',source,line:r.line};
  });
}
export function parseMeta(rows,source,operation='mvave-br') {
  return records(rows).map(r=>{
    const level=r['Nome do anúncio']?'ad':r['Nome do conjunto de anúncios']?'adset':r['Nome da campanha']?'campaign':null;check(level,'Nível Meta não identificado; remova linhas de total');
    const idColumn=level==='ad'?'Identificação do anúncio':level==='adset'?'Identificação do conjunto de anúncios':'Identificação da campanha';
    const id=clean(r[idColumn]);const idPrecision=/^\d+$/.test(id)&&(r[idColumn+'__type']==='s'||r[idColumn+'__type']==='inlineStr')?'exact':'rounded';
    const name=r['Nome do anúncio']||r['Nome do conjunto de anúncios']||r['Nome da campanha'];
    const start=day(r['Início dos relatórios']),end=day(r['Encerramento dos relatórios']);check(start<=end,'Período Meta inválido');
    const moneyColumn=Object.keys(r).find(k=>/^Valor gasto \([A-Z]{3}\)$/.test(k));check(moneyColumn,'Gasto/moeda Meta ausente');
    const count=k=>Object.hasOwn(r,k)?r[k]===''?0:Number(r[k]):null;
    const result={key:hash(JSON.stringify([operation,start,end,level,id||name,r['Nome do conjunto de anúncios']])),operation,start,end,level,id,idPrecision,name,campaign:clean(r['Nome da campanha'])||null,adset:clean(r['Nome do conjunto de anúncios'])||null,currency:moneyColumn.match(/\(([A-Z]{3})\)/)[1],spend:cents(r[moneyColumn]),impressions:count('Impressões'),clicks:count('Cliques no link'),views:count('Visualizações da página de destino do site'),checkouts:count('Finalizações de compra iniciadas'),purchases:count('Compras'),purchaseValue:Object.hasOwn(r,'Valor de conversão da compra')?cents(r['Valor de conversão da compra']||'0'):null,budget:cents(/^\d/.test(r['Orçamento do conjunto de anúncios']??'')?r['Orçamento do conjunto de anúncios']:''),status:clean(r['Veiculação de anúncio']),group:/\[?[VBG]S\d|sorteio/i.test(name)?/RMKT/i.test(name)?'sorteio remarketing':'sorteio frio':'tradicional',source,line:r.line};
    check(result.spend!==null,'Gasto ausente');for(const k of ['impressions','clicks','views','checkouts','purchases'])check(result[k]===null||Number.isSafeInteger(result[k])&&result[k]>=0,'Contagem inválida: '+k);return result;
  });
}
export function reconcile(base,batch) {
  if(base.snapshots.some(s=>s.hash===batch.hash))return {base,changes:[],duplicate:true};
  const next=structuredClone(base),changes=[];const kind=batch.provider==='hotmart'?'orders':'meta';const keys=new Set();
  for(const row of batch.rows){check(!keys.has(row.key),'Linha/identidade duplicada no export');keys.add(row.key);}
  if(kind==='meta') {
    const identities=new Set();for(const row of batch.rows){if(!row.id)continue;const identity=[row.start,row.end,row.level,row.id].join('|');check(!identities.has(identity),'ID Meta duplicado ou colisão de arredondamento: revisar');identities.add(identity);}
    const currencies=[...new Set(batch.rows.map(r=>r.currency))];const levels=[...new Set(batch.rows.map(r=>r.level))];check(levels.length===1,'Níveis Meta misturados');
    for(const row of next.meta.filter(r=>r.operation===batch.operation&&currencies.includes(r.currency)))if(row.start<=batch.end&&row.end>=batch.start)check(row.start>=batch.start&&row.end<=batch.end,'Sobreposição parcial Meta: envie a janela completa para substituição');
    next.meta=next.meta.filter(r=>!(r.operation===batch.operation&&currencies.includes(r.currency)&&r.start>=batch.start&&r.end<=batch.end));
  }
  for(const row of batch.rows){const index=next[kind].findIndex(o=>o.key===row.key);const old=index<0?base[kind].find(o=>o.key===row.key):next[kind][index];if(!old||JSON.stringify({...old,source:null,line:null})!==JSON.stringify({...row,source:null,line:null}))changes.push({key:row.key,day:row.day??row.start,before:old?{status:old.status,gross:old.gross,net:old.net,spend:old.spend}:null,after:{status:row.status,gross:row.gross,net:row.net,spend:row.spend},late:!old&&base.snapshots.some(s=>s.provider===batch.provider&&s.start<=(row.day??row.start)&&s.end>=(row.day??row.start))});if(index<0)next[kind].push(row);else next[kind][index]=row;}
  next.snapshots.push({...batch,rows:batch.rows.length,changes});next.ads=Object.values(Object.fromEntries([...next.ads??[],...next.meta.filter(r=>r.level==='ad')].map(r=>[r.id+'|'+r.name,r])));return {base:next,changes,duplicate:false};
}
export function closing(base,start,end,currency='BRL') {
  const orders=base.orders.filter(o=>o.operation==='mvave-br'&&o.currency===currency&&o.day>=start&&o.day<=end&&approved(o)&&o.category!=='REVISAR');
  const meta=base.meta.filter(r=>r.operation==='mvave-br'&&r.currency===currency&&r.start>=start&&r.end<=end);
  const sum=(rows,k)=>rows.length&&rows.every(r=>r[k]!==null)?rows.reduce((s,r)=>s+r[k],0):null;
  const main=orders.filter(o=>o.category==='principal'),bumps=orders.filter(o=>o.category==='bump'),upgrades=orders.filter(o=>o.category==='upgrade');
  const spend=sum(meta,'spend'),gross=sum(orders,'gross'),net=sum(orders,'net');
  const exact=new Set((base.ads??[]).filter(r=>r.level==='ad'&&r.idPrecision==='exact').map(r=>r.id));const direct=main.filter(o=>exact.has(o.sck));
  const principals=new Set(main.map(o=>o.transaction)).size,directOrders=new Set(direct.map(o=>o.transaction)).size;
  return {start,end,currency,spend,gross,net,principal:principals,bumps:bumps.length,upgrades:upgrades.length,buyers:main.every(o=>o.buyer)?new Set(main.map(o=>o.buyer)).size:null,frontGross:sum(main,'gross'),frontNet:sum(main,'net'),bumpGross:sum(bumps,'gross'),bumpNet:sum(bumps,'net'),upgradeGross:sum(upgrades,'gross'),upgradeNet:sum(upgrades,'net'),direct:directOrders,blended:principals-directOrders,contribution:net!==null&&spend!==null?net-spend:null,cpa:spend!==null&&principals?spend/principals:null,roas:spend&&gross!==null?gross/spend:null,metaPurchases:sum(meta,'purchases'),metaValue:sum(meta,'purchaseValue'),clicks:sum(meta,'clicks'),views:sum(meta,'views'),checkouts:sum(meta,'checkouts'),impressions:sum(meta,'impressions')};
}

export function creativeResults(base,start,end,currency='BRL') {
  const media=base.meta.filter(r=>r.operation==='mvave-br'&&r.currency===currency&&r.start>=start&&r.end<=end);
  const sales=base.orders.filter(o=>o.operation==='mvave-br'&&o.currency===currency&&o.day>=start&&o.day<=end&&approved(o)&&o.category==='principal');
  const groups=new Map();
  for(const row of media){const key=row.level+'|'+(row.id||row.key);const group=groups.get(key)??{...row,spend:0,days:[],sources:[]};group.spend+=row.spend;group.days.push(row.start);group.sources.push({hash:row.source,line:row.line});groups.set(key,group);}
  for(const ad of base.ads??[])if(ad.level==='ad'&&ad.idPrecision==='exact'&&sales.some(o=>o.sck===ad.id)&&!groups.has('ad|'+ad.id))groups.set('ad|'+ad.id,{...ad,spend:null,days:[],sources:[]});
  return [...groups.values()].map(ad=>{const exact=ad.level==='ad'&&ad.idPrecision==='exact';const direct=exact?sales.filter(o=>o.sck===ad.id):[];const gross=exact?direct.reduce((s,o)=>s+o.gross,0):null;const net=exact&&direct.every(o=>o.net!==null)?direct.reduce((s,o)=>s+o.net,0):null;const orders=exact?new Set(direct.map(o=>o.transaction)).size:null;return {...ad,orders,gross,net,cpa:orders&&ad.spend!==null?ad.spend/orders:null,roas:ad.spend&&gross!==null?gross/ad.spend:null,contribution:net!==null&&ad.spend!==null?net-ad.spend:null,possiblyLate:direct.length>0&&(ad.spend===null||ad.spend===0||ad.status==='paused'),salesDays:new Set(direct.map(o=>o.day)).size,action:'OBSERVAR',reason:exact?'Atribuição técnica SCK; comparar repetição e contribuição em janelas completas. Não comprova incrementabilidade.':'Atribuição direta não verificável; solicitar ID textual e nível anúncio.'};});
}
