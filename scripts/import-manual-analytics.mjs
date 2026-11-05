import {spawnSync} from 'node:child_process';
import {createCipheriv,createHash,pbkdf2Sync,randomBytes} from 'node:crypto';
import {readFileSync,readdirSync,writeFileSync} from 'node:fs';
import {basename,join,resolve} from 'node:path';

// Imports only financial fields. Buyer data and original transaction identifiers
// never enter the published package. All report data is encrypted.
const [sourceDir,outputPath,...flags]=process.argv.slice(2);
if (!sourceDir || !outputPath || flags.some(flag=>flag!=='--new-key')) {
  throw Error('Use: node scripts/import-manual-analytics.mjs <pasta-dos-exports> <arquivo.enc.json> [--new-key]');
}
const monthNames=['Janeiro','Fevereiro','Março','Abril','Maio','Junho','Julho','Agosto','Setembro','Outubro','Novembro','Dezembro'];
const files=readdirSync(sourceDir);
const labels=new Set(files.map(f=>f.match(/^(?:Meta|Hotmart) \((.+)\)\.(?:xlsx|xls)$/)?.[1]).filter(Boolean));
const pairs=[...labels].map(label=>({month:label,index:monthNames.findIndex(month=>label===month||label.startsWith(month+' ')),meta:files.find(f=>f===`Meta (${label}).xlsx`),hotmart:files.find(f=>f===`Hotmart (${label}).xls`)}));
if (!pairs.length || pairs.some(p=>p.index<0||!p.meta||!p.hotmart)) throw Error('Cada período precisa de Meta (<rótulo>).xlsx e Hotmart (<rótulo>).xls. Use o mesmo rótulo para o par.');
const required=(condition,message)=>{if(!condition)throw Error(message);};
const rows=path=>{
  const run=spawnSync('powershell.exe',['-NoProfile','-ExecutionPolicy','Bypass','-File',resolve(import.meta.dirname,'xlsx-rows.ps1'),path],{encoding:'utf8',maxBuffer:50_000_000});
  if(run.status!==0)throw Error(`Falha ao ler ${basename(path)}: ${run.stderr||run.stdout}`);
  return JSON.parse(run.stdout);
};
function cents(value,label) {
  const match=String(value??'').match(/^(-?)(\d+)(?:\.(\d+))?$/);
  required(match,`${label}: valor monetário inválido`);
  const fraction=(match[3]||'').padEnd(3,'0');
  const result=(match[1]?-1:1)*(Number(match[2])*100+Number(fraction.slice(0,2))+(Number(fraction[2])>=5?1:0));
  required(Number.isSafeInteger(result),`${label}: valor fora do limite`);
  return result;
}
function count(value,label) {
  const n=Number(value);
  required(Number.isSafeInteger(n)&&n>=0,`${label}: contagem inválida`);
  return n;
}
const transactions=new Set();
const periods=[];
const dataset={organizationId:'mvave-br',organization:'Mvave BR',mode:'manual',accounts:[{id:'manual-meta',name:'Mvave BR · Meta'}],orders:[],insights:[],mappings:[],sync:[],followers:[]};
const reference=value=>createHash('sha256').update(value).digest('hex').slice(0,16);
for(const pair of pairs) {
  const metaPath=join(sourceDir,pair.meta),hotmartPath=join(sourceDir,pair.hotmart);
  const meta=rows(metaPath),sales=rows(hotmartPath);
  required(meta[0]?.A==='Início dos relatórios'&&meta[0]?.K==='Valor gasto (BRL)'&&meta[0]?.L==='Impressões'&&meta[0]?.F==='Resultados'&&meta[0]?.G==='Indicador de resultados','Esquema Meta desconhecido');
  required(sales[0]?.A==='Código da transação'&&sales[0]?.B==='Status da transação'&&sales[0]?.Q==='Faturamento bruto (sem impostos)'&&sales[0]?.R==='Faturamento líquido','Esquema Hotmart desconhecido');
  required(meta.length>1&&sales.length>1,`${pair.month}: export vazio`);
  const start=meta[1].A,end=meta[1].B;
  required(/^\d{4}-\d{2}-\d{2}$/.test(start)&&/^\d{4}-\d{2}-\d{2}$/.test(end)&&start<=end&&Number(start.slice(5,7))===pair.index+1&&Number(end.slice(5,7))===pair.index+1,`${pair.month}: período inválido`);
  const days=Math.round((Date.parse(end)-Date.parse(start))/86400000)+1;
  const period={id:start,start,end,days,month:pair.month,spend:0,impressions:0,metaPurchases:0,gross:0,net:0,sales:0,brlSales:0,usdGross:0,usdNet:0,usdSales:0,sourceSignals:0,ads:[],products:[],daily:[],statuses:{},payments:{},sources:[]};
  const ads=new Map(),products=new Map(),daily=new Map();
  for(let day=start;day<=end;day=new Date(Date.parse(day)+86400000).toISOString().slice(0,10))daily.set(day,{date:day,gross:0,net:0,sales:0,brlSales:0,usdGross:0,usdNet:0,usdSales:0});
  for(const row of meta.slice(1)) {
    required(row.A===start&&row.B===end&&row.C,`${pair.month}: período ou anúncio Meta inconsistente`);
    required(!row.G||row.G==='actions:offsite_conversion.fb_pixel_purchase',`${pair.month}: indicador Meta inesperado`);
    required(row.G||!row.F,`${pair.month}: resultado Meta sem indicador`);
    const spend=cents(row.K,`${pair.month} Meta`),impressions=count(row.L||'0',`${pair.month} impressões`),purchases=row.G?count(row.F,`${pair.month} compras Meta`):0;
    required(spend>=0,`${pair.month}: gasto negativo`);
    period.spend+=spend;period.impressions+=impressions;period.metaPurchases+=purchases;
    const name=row.C.trim(),ad=ads.get(name)||{name,spend:0,impressions:0,purchases:0};
    const adset=String(row.U||'Conjunto não informado').trim();
    dataset.insights.push({date:start,periodEnd:end,accountId:'manual-meta',campaignId:'manual',campaign:'Campanha não informada no export',adsetId:reference(adset),adset,adId:reference(adset+'|'+name),ad:name,status:'UNKNOWN',currency:'BRL',spend,impressions,purchases,clicks:null,views:null,checkouts:null,purchaseValue:null,reach:row.M?count(row.M,'Alcance'):null});
    ad.spend+=spend;ad.impressions+=impressions;ad.purchases+=purchases;ads.set(name,ad);
  }
  for(const row of sales.slice(1)) {
    const transaction=row.A,status=row.B;
    required(transaction&&!transactions.has(transaction),`${pair.month}: transação duplicada`);transactions.add(transaction);
    required(['Completo','Aprovado','Reembolsado','Cancelado','Chargeback'].includes(status),`${pair.month}: status Hotmart inesperado: ${status}`);
    period.statuses[status]=(period.statuses[status]||0)+1;
    const match=String(row.C).match(/^(\d{2})\/(\d{2})\/(\d{4}) /);
    required(match,`${pair.month}: data Hotmart inválida`);
    const day=`${match[3]}-${match[2]}-${match[1]}`;
    required(daily.has(day),`${pair.month}: transação fora do período Meta`);
    required(row.S==='Produtor',`${pair.month}: papel Hotmart inesperado`);
    required(['BRL','USD'].includes(row.P),`${pair.month}: moeda Hotmart inesperada`);
    if(!['Completo','Aprovado'].includes(status))continue;
    const gross=cents(row.Q,`${pair.month} Hotmart bruto`),net=cents(row.R,`${pair.month} Hotmart líquido`);
    required(gross>=0&&net>=0,`${pair.month}: receita negativa inesperada`);
    const currency=row.P,productName=String(row.G||'').trim();
    required(productName,`${pair.month}: produto sem nome`);
    const product=products.get(productName)||{name:productName,gross:0,net:0,sales:0,brlSales:0,usdGross:0,usdNet:0,usdSales:0};
    for(const item of [period,product,daily.get(day)]) {
      item.sales++;
      item[currency==='BRL'?'gross':'usdGross']+=gross;
      item[currency==='BRL'?'net':'usdNet']+=net;
      item[currency==='BRL'?'brlSales':'usdSales']++;
    }
    if(row.AC||row.AD)period.sourceSignals++;
    const payment=String(row.AE||'Não informado').trim();
    dataset.orders.push({transaction:'ref-'+reference(transaction),accountId:'manual-hotmart',productId:String(row.F),product:productName,offer:null,status:status==='Completo'?'COMPLETE':'APPROVED',purchasedAt:day+'T12:00:00-03:00',approvedAt:null,currency,gross,net,payment,source:{},manualSourcePresent:Boolean(row.AC||row.AD),parentTransaction:null,isBump:false,isFunnel:false});
    period.payments[payment]=(period.payments[payment]||0)+1;
    products.set(productName,product);
  }
  period.ads=[...ads.values()];period.products=[...products.values()];period.daily=[...daily.values()];
  period.sources=[{name:basename(metaPath),rows:meta.length-1,sha256:createHash('sha256').update(readFileSync(metaPath)).digest('hex')},{name:basename(hotmartPath),rows:sales.length-1,sha256:createHash('sha256').update(readFileSync(hotmartPath)).digest('hex')}];
  required(period.products.reduce((sum,p)=>sum+p.gross,0)===period.gross&&period.daily.reduce((sum,d)=>sum+d.net,0)===period.net,`${pair.month}: conciliação falhou`);
  periods.push(period);
}
periods.sort((a,b)=>a.start.localeCompare(b.start));
for(let i=1;i<periods.length;i++)required(periods[i-1].end<periods[i].start,'Períodos mensais sobrepostos');
const report={schemaVersion:1,mode:'manual',client:{id:'mvave-br',name:'Mvave BR'},coverage:{meta:'per-export',hotmart:'daily',brands:['Mvave BR'],missingBrands:['Oficina do Violão']},periods};
dataset.manualPeriods=periods.map(({start,end,month,sources})=>({start,end,month,sources}));
const coverage={start:Date.parse(periods[0].start+'T00:00:00-03:00'),end:Date.parse(periods[0].end+'T23:59:59.999-03:00')};
const windows=[coverage];
for(const p of periods.slice(1)) {const start=Date.parse(p.start+'T00:00:00-03:00'),end=Date.parse(p.end+'T23:59:59.999-03:00');const last=windows.at(-1);if(start===last.end+1)last.end=end;else windows.push({start,end});}
dataset.coverage={meta:windows,hotmart:windows};report.dataset=dataset;
const passphrase=flags.includes('--new-key')?randomBytes(32).toString('base64url'):await new Promise((resolve,reject)=>{
  let input='';process.stdin.setEncoding('utf8');process.stdin.on('data',chunk=>input+=chunk);process.stdin.on('end',()=>resolve(input.trim()));process.stdin.on('error',reject);
});
required(passphrase.length>=20,'A chave de dados precisa ter pelo menos 20 caracteres.');
const salt=randomBytes(16),iv=randomBytes(12),key=pbkdf2Sync(passphrase,salt,600000,32,'sha256');
const cipher=createCipheriv('aes-256-gcm',key,iv);
const encrypted=Buffer.concat([cipher.update(JSON.stringify(report),'utf8'),cipher.final(),cipher.getAuthTag()]);
writeFileSync(outputPath,JSON.stringify({version:1,kdf:'PBKDF2-SHA256',iterations:600000,salt:salt.toString('base64'),iv:iv.toString('base64'),data:encrypted.toString('base64')})+'\n');
console.log(JSON.stringify({periods:periods.map(({month,start,end,spend,gross,net,sales,metaPurchases,usdSales})=>({month,start,end,spend,gross,net,sales,metaPurchases,usdSales})),files:periods.flatMap(p=>p.sources).length,output:outputPath}));
if(flags.includes('--new-key'))console.log(`CHAVE_DE_DADOS=${passphrase}`);
