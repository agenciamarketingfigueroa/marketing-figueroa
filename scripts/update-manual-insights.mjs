// Read updated Hotmart and Instagram exports and update the existing sealed report.
// The input key arrives on stdin; buyer details and raw tracking codes are omitted.
import {spawnSync} from 'node:child_process';
import {createCipheriv,createDecipheriv,createHash,pbkdf2Sync,randomBytes} from 'node:crypto';
import {readFileSync,writeFileSync,existsSync} from 'node:fs';
import {join,basename} from 'node:path';
import {parseManualMeta} from './manual-meta.mjs';
const [directory,reportPath]=process.argv.slice(2);
if(!directory||!reportPath)throw Error('Use: node scripts/update-manual-insights.mjs <pasta> <relatorio.enc.json>');
const passphrase=await new Promise(resolve=>{let s='';process.stdin.setEncoding('utf8');process.stdin.on('data',x=>s+=x);process.stdin.on('end',()=>resolve(s.trim()));});
const b64=x=>Buffer.from(x,'base64');
const csvText=path=>{const bytes=readFileSync(path);return bytes[0]===0xff&&bytes[1]===0xfe?bytes.toString('utf16le').replace(/^\uFEFF/,''):bytes.toString('utf8').replace(/^\uFEFF/,'');};
const envelope=JSON.parse(readFileSync(reportPath,'utf8'));
const key=pbkdf2Sync(passphrase,b64(envelope.salt),envelope.iterations,32,'sha256');
const ciphertext=b64(envelope.data),decipher=createDecipheriv('aes-256-gcm',key,b64(envelope.iv));decipher.setAuthTag(ciphertext.subarray(-16));
const report=JSON.parse(Buffer.concat([decipher.update(ciphertext.subarray(0,-16)),decipher.final()]).toString('utf8'));
if(report.dataset?.mode!=='manual'||!report.periods?.length)throw Error('Relatório incompatível');
const dataset=report.dataset,orders=[],instagram=[],seen=new Set(),metaInsights=[],metaSummaries=[],instagramSources=[];
const hash=x=>createHash('sha256').update(x).digest('hex').slice(0,16);
const clean=x=>!x||x==='(none)'?'':String(x).trim();
const cents=x=>{if(!/^\d+(\.\d+)?$/.test(x))throw Error('Valor inválido');return Math.round(Number(x)*100);};
const statusMap={'Completo':'COMPLETE','Aprovado':'APPROVED','Reembolsado':'REFUNDED','Cancelado':'CANCELLED','Chargeback':'CHARGEBACK','Aguardando pagamento':'WAITING_PAYMENT','Boleto impresso':'PRINTED_BILLET'};
for(const period of report.periods) {
 const path=join(directory,`Hotmart (${period.month}).xls`),run=spawnSync('powershell.exe',['-NoProfile','-ExecutionPolicy','Bypass','-File',new URL('./xlsx-rows.ps1',import.meta.url).pathname.replace(/^\/(\w:)/,'$1'),path],{encoding:'utf8',maxBuffer:50_000_000});
 if(run.status!==0)throw Error('Falha ao ler '+basename(path));
 const rows=JSON.parse(run.stdout);if(rows[0]?.A!=='Código da transação'||rows[0]?.BD!=='Ferramenta de Venda')throw Error('Esquema Hotmart não reconhecido');
 const imported=[];
 for(const row of rows.slice(1)) {
  const date=String(row.C).match(/^(\d{2})\/(\d{2})\/(\d{4}) /),status=statusMap[row.B];
  if(!date||!status||!row.A||seen.has(row.A)||!['BRL','USD'].includes(row.P)||row.S!=='Produtor')throw Error('Registro Hotmart inválido ou duplicado');
  seen.add(row.A);const day=`${date[3]}-${date[2]}-${date[1]}`;
  if(day<period.start||day>period.end)throw Error('Transação fora da cobertura');
  const sck=clean(row.AD),src=clean(row.AC),channel=clean(row.AB),tool=clean(row.BD),parent=clean(row.BE);
  const category=/^\d{10,}$/.test(sck)?'Código numérico SCK':/HOTMART_SALES_AGENT/i.test(sck)?'Hotmart Sales Agents':/HOTMART_(SITE|PRODUCT_PAGE)|Site da Hotmart|Página de Produto Hotmart/i.test(sck+' '+channel)?'Marketplace Hotmart':sck||src?'Outro código de origem':'Sem código de origem';
  const knownTool=['Produto order bump','Produto principal','Hotmart Recomenda'].includes(tool)?tool:tool?'Outra ferramenta informada':'Não informada';
  imported.push({transaction:'ref-'+hash(row.A),accountId:'manual-hotmart',productId:String(row.F),product:String(row.G).trim(),offer:null,status,purchasedAt:day+'T12:00:00-03:00',approvedAt:null,currency:row.P,gross:cents(row.Q),net:cents(row.R),payment:clean(row.AE)||'Não informado',source:{},manualSourcePresent:Boolean(sck||src),manualSourceCategory:category,manualTool:knownTool,parentTransaction:parent?'ref-'+hash(parent):null,isBump:tool==='Produto order bump',isFunnel:false});
 }
 const approved=imported.filter(x=>x.status==='COMPLETE'||x.status==='APPROVED');
 if(approved.length!==period.sales||approved.filter(x=>x.currency==='BRL').reduce((s,x)=>s+x.gross,0)!==period.gross||approved.filter(x=>x.currency==='BRL').reduce((s,x)=>s+x.net,0)!==period.net)throw Error(`Vendas aprovadas mudaram em ${period.month}; confira antes de substituir.`);
 orders.push(...imported);period.statuses=Object.fromEntries(Object.keys(statusMap).map(status=>[status,rows.slice(1).filter(r=>r.B===status).length]).filter(([,v])=>v));
 const source={name:basename(path),rows:rows.length-1,sha256:createHash('sha256').update(readFileSync(path)).digest('hex')};period.sources=period.sources.map(s=>s.name.startsWith('Hotmart (')?source:s);
 const metaPath=join(directory,`Meta (${period.month}).xlsx`);
 if(existsSync(metaPath)) {
  const metaRun=spawnSync('powershell.exe',['-NoProfile','-ExecutionPolicy','Bypass','-File',new URL('./xlsx-rows.ps1',import.meta.url).pathname.replace(/^\/(\w:)/,'$1'),metaPath],{encoding:'utf8',maxBuffer:50_000_000});
  if(metaRun.status!==0)throw Error('Falha ao ler '+basename(metaPath));
  const parsed=parseManualMeta(JSON.parse(metaRun.stdout),period);
  if(parsed.totals.spend!==period.spend||parsed.totals.purchases!==period.metaPurchases)throw Error('Gasto ou compras Meta mudaram; concilie os novos totais antes de substituir.');
  metaInsights.push(...parsed.insights);metaSummaries.push({month:period.month,...parsed.totals,roundedIds:parsed.roundedIds});
  period.impressions=parsed.totals.impressions;
  const ads=new Map();for(const row of parsed.insights){const ad=ads.get(row.ad)||{name:row.ad,spend:0,impressions:0,purchases:0};ad.spend+=row.spend;ad.impressions+=row.impressions;ad.purchases+=row.purchases;ads.set(row.ad,ad);}period.ads=[...ads.values()];
  period.sources=period.sources.map(s=>s.name.startsWith('Meta (')?{name:basename(metaPath),rows:parsed.insights.length,sha256:createHash('sha256').update(readFileSync(metaPath)).digest('hex')}:s);
 }
 const dataByDay=new Map();
 for(const [name,field,title] of [['Visualizações','views','Visualizações'],['Interações','interactions','Interações com o conteúdo'],['Seguidores','followers','Seguidores no Instagram']]) {
  const file=join(directory,`${name} (${period.month}).csv`),lines=csvText(file).split(/\r?\n/).filter(Boolean);
  if(lines[0]!=='sep=,'||lines[1]!==`"${title}"`||lines[2]!=='"Data","Primary"')throw Error('CSV desconhecido: '+basename(file));
  let count=0;
  for(const line of lines.slice(3)) {const match=line.match(/^"(\d{4}-\d\d-\d\d)T00:00:00","(\d+)"$/);if(!match||match[1]<period.start||match[1]>period.end)throw Error('Data ou valor inválido: '+basename(file));const day=dataByDay.get(match[1])||{date:match[1]};if(field in day)throw Error('Data duplicada');day[field]=Number(match[2]);dataByDay.set(match[1],day);count++;}
  if(count!==period.days)throw Error('Cobertura incompleta: '+basename(file));
  instagramSources.push({name:basename(file),rows:count,sha256:createHash('sha256').update(readFileSync(file)).digest('hex')});
 }
 instagram.push(...dataByDay.values());
}
dataset.orders=orders;dataset.manualStatusComplete=true;dataset.instagramDaily=instagram.sort((a,b)=>a.date.localeCompare(b.date));dataset.instagramFollowersKind='new';dataset.instagramSources=instagramSources;
if(metaInsights.length) {if(metaSummaries.length!==report.periods.length)throw Error('Envie os três exports Meta para atualizar o conjunto.');dataset.insights=metaInsights;dataset.manualMetaIdPrecision=metaSummaries.some(m=>m.roundedIds)?'rounded':'exact';dataset.creatives=[];}
dataset.manualPeriods=dataset.manualPeriods.map(p=>({...p,sources:report.periods.find(x=>x.start===p.start).sources}));
const audience=csvText(join(directory,'Público Geral.csv')).split(/\r?\n/).filter(Boolean);
const parse=line=>(line.match(/"(?:[^"]|"")*"/g)||[]).map(x=>x.slice(1,-1).replaceAll('""','"'));
const ageStart=audience.indexOf('"Faixa etária e gênero"'),cityStart=audience.indexOf('"Principais cidades"'),countryStart=audience.indexOf('"Principais países"');
if(ageStart<0||cityStart<0||countryStart<0)throw Error('Público geral não reconhecido');
const paired=(index)=>{const labels=parse(audience[index+1]),values=parse(audience[index+2]);if(labels.length!==values.length)throw Error('Público inconsistente');return labels.map((label,i)=>({label,value:Number(values[i])}));};
dataset.instagramAudience={age:audience.slice(ageStart+2,cityStart).map(line=>{const [label,men,women]=parse(line);return {label,men:Number(men),women:Number(women)};}),cities:paired(cityStart),countries:paired(countryStart)};
const salt=randomBytes(16),iv=randomBytes(12),newKey=pbkdf2Sync(passphrase,salt,600000,32,'sha256'),cipher=createCipheriv('aes-256-gcm',newKey,iv);
const data=Buffer.concat([cipher.update(JSON.stringify(report)),cipher.final(),cipher.getAuthTag()]);
writeFileSync(reportPath,JSON.stringify({version:1,kdf:'PBKDF2-SHA256',iterations:600000,salt:salt.toString('base64'),iv:iv.toString('base64'),data:data.toString('base64')})+'\n');
console.log(JSON.stringify({orders:orders.length,refunds:orders.filter(o=>o.status==='REFUNDED').length,instagramDays:instagram.length,instagramTotals:instagram.reduce((a,r)=>({views:a.views+r.views,interactions:a.interactions+r.interactions,followers:a.followers+r.followers}),{views:0,interactions:0,followers:0}),meta:metaSummaries,periods:report.periods.map(p=>p.month)}));
