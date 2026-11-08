import {readFileSync,writeFileSync,mkdirSync,existsSync,copyFileSync,renameSync} from 'node:fs';
import {resolve,basename} from 'node:path';
import {createCipheriv,createDecipheriv,pbkdf2Sync,randomBytes} from 'node:crypto';
import {fileURLToPath} from 'node:url';
import {hash,readRows,parseHotmart,parseMeta,reconcile,closing,check} from './core.mjs';
import {generateReports} from './relatorios.mjs';
import {summary} from '../../scripts/manual-daily-import.mjs';
const root=resolve(fileURLToPath(new URL('..',import.meta.url)));
export function unseal(envelope,secret){const b=Buffer.from(envelope.data,'base64');const d=createDecipheriv('aes-256-gcm',pbkdf2Sync(secret,Buffer.from(envelope.salt,'base64'),envelope.iterations,32,'sha256'),Buffer.from(envelope.iv,'base64'));d.setAuthTag(b.subarray(-16));return JSON.parse(Buffer.concat([d.update(b.subarray(0,-16)),d.final()]));}
export function seal(data,secret){const salt=randomBytes(16),iv=randomBytes(12),c=createCipheriv('aes-256-gcm',pbkdf2Sync(secret,salt,600000,32,'sha256'),iv);return {version:1,kdf:'PBKDF2-SHA256',iterations:600000,salt:salt.toString('base64'),iv:iv.toString('base64'),data:Buffer.concat([c.update(JSON.stringify(data)),c.final(),c.getAuthTag()]).toString('base64')};}
function write(path,data){mkdirSync(resolve(path,'..'),{recursive:true});writeFileSync(path+'.tmp',typeof data==='string'?data:JSON.stringify(data,null,2)+'\n');renameSync(path+'.tmp',path);}
export function bridge(report,base) {
  const next=structuredClone(report),d=next.dataset;
  const days=[...new Set(base.meta.filter(r=>r.start===r.end&&r.level==='ad').map(r=>r.start))].sort();
  const hotDays=[...new Set(base.orders.map(o=>o.day))];
  const convertible=base.orders.filter(o=>o.operation==='mvave-br'&&o.category!=='REVISAR'&&o.status!=='REVISAR');
  const importedTransactions=new Set(base.orders.map(o=>'ref-'+hash(o.transaction).slice(0,16)));
  const itemTransactions=new Set(base.orders.map(o=>'ref-'+hash(o.transaction+'|'+o.item).slice(0,16)));
  d.orders=d.orders.filter(o=>!importedTransactions.has(o.transaction)&&!itemTransactions.has(o.transaction));
  const itemCount=new Map();for(const o of base.orders)itemCount.set(o.transaction,(itemCount.get(o.transaction)??0)+1);
  // Match the existing anonymous transaction convention; snapshots replace by transaction, not by sum.
  for(const o of convertible){const id='ref-'+hash(itemCount.get(o.transaction)>1?o.transaction+'|'+o.item:o.transaction).slice(0,16);d.orders.push({transaction:id,mainOrderId:'ref-'+hash(o.transaction).slice(0,16),accountId:'manual-hotmart',productId:o.item,product:o.product,offer:null,status:o.status,purchasedAt:o.day+'T12:00:00-03:00',approvedAt:null,currency:o.currency,gross:o.gross,net:o.net,payment:'Não informado',source:{},manualSourcePresent:Boolean(o.sck),manualSourceCategory:/^\d+$/.test(o.sck)?'Código numérico SCK':o.sck?'Outro código de origem':'Sem código de origem',parentTransaction:o.parent?'ref-'+hash(o.parent).slice(0,16):null,isBump:o.category==='bump',isFunnel:o.category==='upgrade'});}
  d.insights=d.insights.filter(r=>!days.includes(r.date));
  for(const r of base.meta.filter(r=>days.includes(r.start)&&r.start===r.end&&r.level==='ad'))d.insights.push({date:r.start,periodEnd:r.end,accountId:'manual-meta',campaignId:'manual',campaign:r.campaign??'Campanha não informada no export',adsetId:'manual',adset:r.adset??'Conjunto não informado no export',adId:'daily-id-'+hash(r.id||r.key).slice(0,16),ad:r.name,status:r.status==='active'?'ACTIVE':r.status==='paused'?'PAUSED':'UNKNOWN',currency:r.currency,spend:r.spend,impressions:r.impressions,clicks:r.clicks,views:r.views,checkouts:r.checkouts,purchases:r.purchases,purchaseValue:r.purchaseValue,reach:null,exportAdId:r.id,idPrecision:r.idPrecision});
  // Remove detailed aggregates overlapping corrected dates: they must not override the new snapshots.
  d.manualMetaAggregates=(d.manualMetaAggregates??[]).filter(r=>!days.some(day=>day>=r.date&&day<=(r.periodEnd??r.date)));
  const allPeriods=d.manualPeriods??[];
  for(const day of days)if(!allPeriods.some(p=>p.start<=day&&p.end>=day))allPeriods.push({start:day,end:day,month:day.split('-').reverse().join('/'),sources:base.snapshots.filter(s=>s.start<=day&&s.end>=day).map(s=>({name:s.name,rows:s.rows,sha256:s.hash}))});
  d.manualPeriods=allPeriods.sort((a,b)=>a.start.localeCompare(b.start));
  for(const p of d.manualPeriods){const sources=base.snapshots.filter(s=>s.start<=p.end&&s.end>=p.start).map(s=>({name:s.name,rows:s.rows,sha256:s.hash}));if(sources.length)p.sources=[...new Map([...p.sources,...sources].map(s=>[s.sha256??s.name,s])).values()];}
  next.periods=d.manualPeriods.map(p=>summary(p,d.orders.filter(o=>o.purchasedAt.slice(0,10)>=p.start&&o.purchasedAt.slice(0,10)<=p.end),d.insights.filter(r=>r.date>=p.start&&(r.periodEnd??r.date)<=p.end),p.sources));
  const window=day=>({start:Date.parse(day+'T00:00:00-03:00'),end:Date.parse(day+'T23:59:59.999-03:00')});
  const unique=rows=>[...new Map(rows.map(r=>[r.start+'|'+r.end,r])).values()];
  d.manualMetaDailyCoverage=unique([...d.manualMetaDailyCoverage??[],...days.map(window)]);
  // File dates establish observed scope, not proof of account-wide completeness.
  d.coverage={meta:unique([...d.coverage?.meta??[],...days.map(window)]),hotmart:unique([...d.coverage?.hotmart??[],...hotDays.map(window)])};
  d.insights.sort((a,b)=>a.date.localeCompare(b.date));d.orders.sort((a,b)=>a.purchasedAt.localeCompare(b.purchasedAt));
  d.intelligence={updatedAt:base.snapshots.at(-1)?.importedAt,days:[...new Set(base.orders.map(o=>o.day).concat(days))].sort().map(day=>closing(base,day,day)),limitations:['Fechamento parcial: filtros de exportação e cobertura de anúncios pausados não confirmados.','IDs Meta numéricos/arredondados não autorizam atribuição SCK exata.','Sem nomes de campanha/conjunto: estrutura física PERFORMANCE + LAB não verificável.','Histórico anterior preservado; classificação principal/bump e SCK auditáveis somente nas fontes reimportadas.']};
  return next;
}
async function main(){
  const [manifestPath,...flags]=process.argv.slice(2);check(manifestPath,'Use: node analise-mvave-br/scripts/importar.mjs manifesto.json [--site]');
  const manifest=JSON.parse(readFileSync(manifestPath,'utf8'));check(Array.isArray(manifest.files),'Manifesto requer files[]');
  const basePath=resolve(root,'dados/normalizados/base.json');let base=existsSync(basePath)?JSON.parse(readFileSync(basePath,'utf8')):{version:1,orders:[],meta:[],ads:[],snapshots:[]};
  const products=JSON.parse(readFileSync(resolve(root,'config/produtos_mvave_br.json'),'utf8'));const staged=[];
  for(const f of manifest.files){check(['hotmart','meta'].includes(f.provider),'Provedor inválido');check(!f.operation||f.operation==='mvave-br','Importador especializado em MVAVE BR; cadastrar política própria para outros clientes');const raw=readFileSync(f.path),digest=hash(raw),rows=readRows(f.path),parsed=f.provider==='hotmart'?parseHotmart(rows,products,digest):parseMeta(rows,digest);const starts=parsed.map(r=>r.day??r.start).sort(),ends=parsed.map(r=>r.day??r.end).sort();check(starts.length,'Arquivo vazio');const batch={provider:f.provider,operation:'mvave-br',name:basename(f.path),hash:digest,importedAt:new Date().toISOString(),start:starts[0],end:ends.at(-1),filters:f.filters??'não informados',rows:parsed};const result=reconcile(base,batch);base=result.base;if(!result.duplicate)staged.push({f,batch,changes:result.changes});}
  let packageNext,secret,packagePath=resolve('assets/reports/manual-analytics.enc.json');
  if(flags.includes('--site')){check(base.meta.every(r=>r.level==='ad'&&r.start===r.end),'Atualização do site requer mídia por dia e anúncio. Rode sem --site para análise local de agregados.');secret=await new Promise(r=>{let s='';process.stdin.setEncoding('utf8');process.stdin.on('data',c=>s+=c);process.stdin.on('end',()=>r(s.trim()));});check(secret.length>=20,'Chave existente necessária via stdin');const previous=unseal(JSON.parse(readFileSync(packagePath,'utf8')),secret);packageNext=seal(bridge(previous,base),secret);unseal(packageNext,secret);}
  for(const {f,batch,changes} of staged){const dest=resolve(root,'dados/originais',batch.provider,batch.hash+basename(f.path).slice(basename(f.path).lastIndexOf('.')));mkdirSync(resolve(dest,'..'),{recursive:true});if(!existsSync(dest))copyFileSync(f.path,dest);check(hash(readFileSync(dest))===batch.hash,'Hash do original divergiu');write(resolve(root,'dados/snapshots',batch.hash+'.json'),{...batch,rows:batch.rows.length,changes,original:dest});}
  if(staged.length){if(existsSync(basePath))copyFileSync(basePath,resolve(root,'dados/snapshots/base-'+Date.now()+'.json'));write(basePath,base);}
  generateReports(base,root);
  if(packageNext){mkdirSync(resolve(root,'dados/snapshots'),{recursive:true});copyFileSync(packagePath,resolve(root,'dados/snapshots/site-'+Date.now()+'.enc.json'));write(packagePath,packageNext);}
  console.log(JSON.stringify({imports:staged.length,snapshots:base.snapshots.length,orders:base.orders.length,metaRows:base.meta.length,siteUpdated:Boolean(packageNext),days:[...new Set(base.orders.map(o=>o.day))].sort().map(day=>closing(base,day,day))},null,2));
}
if(process.argv[1]&&resolve(process.argv[1])===fileURLToPath(import.meta.url))await main();
