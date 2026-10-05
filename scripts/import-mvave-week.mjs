import {spawnSync} from 'node:child_process';
import {readFileSync,writeFileSync} from 'node:fs';
import {createHash} from 'node:crypto';
import {resolve,basename} from 'node:path';

const [adsPath,hotmartPath,outputPath]=process.argv.slice(2);
if(!adsPath||!hotmartPath)throw Error('Use: import-mvave-week.mjs <Ads.xlsx> <Hotmart.xls>');
const script=resolve(import.meta.dirname,'xlsx-rows.ps1');
function rows(path) {
  const run=spawnSync('powershell.exe',['-NoProfile','-ExecutionPolicy','Bypass','-File',script,path],{encoding:'utf8',maxBuffer:50_000_000});
  if(run.status!==0)throw Error(run.stderr||run.stdout);
  return JSON.parse(run.stdout);
}
function assert(ok,message){if(!ok)throw Error(message);}
function cents(value){
  const match=String(value||'0').match(/^(-?)(\d+)(?:\.(\d+))?$/);
  assert(match,'Valor monetário inválido');
  const fraction=(match[3]||'').padEnd(3,'0');
  return (match[1]? -1:1)*(Number(match[2])*100+Number(fraction.slice(0,2))+(Number(fraction[2])>=5?1:0));
}
function integer(value){const n=Number(value||0);assert(Number.isInteger(n),'Contagem inválida');return n;}
const adsRows=rows(adsPath),salesRows=rows(hotmartPath);
assert(adsRows[0].G==='Valor gasto (BRL)'&&adsRows[0].U==='Compras','Esquema Meta desconhecido');
assert(salesRows[0].B==='Status da transação'&&salesRows[0].Q==='Faturamento bruto (sem impostos)','Esquema Hotmart desconhecido');
const adsRecords=adsRows.slice(1),salesRecords=salesRows.slice(1);
const start=adsRecords[0].A,end=adsRecords[0].B;
assert(start==='2026-09-28'&&end==='2026-10-04','Período diferente do esperado');
const days=Math.round((Date.parse(end)-Date.parse(start))/86400000)+1;
const week={id:start,start,end,days,spend:0,clicks:0,views:0,checkouts:0,purchases:0,metaRevenue:0,gross:0,net:0,sales:0,brlSales:0,usdGross:0,usdNet:0,usdSales:0,ads:[],products:[],daily:[],sources:[],statuses:{}};
for(const [path,records] of [[adsPath,adsRecords],[hotmartPath,salesRecords]])week.sources.push({name:basename(path),sha256:createHash('sha256').update(readFileSync(path)).digest('hex'),rows:records.length});
const ads=new Map(),products=new Map(),daily=new Map(),transactions=new Set();
for(let offset=0;offset<days;offset++){
  const date=new Date(Date.parse(start)+offset*86400000).toISOString().slice(0,10);
  daily.set(date,{date,gross:0,net:0,sales:0,brlSales:0,usdGross:0,usdNet:0,usdSales:0});
}
for(const r of adsRecords){
  assert(r.A===start&&r.B===end&&r.C,'Período ou anúncio inválido');
  const ad=ads.get(r.C)||{name:r.C,spend:0,clicks:0,views:0,checkouts:0,purchases:0,metaRevenue:0};
  for(const [key,col] of [['spend','G'],['clicks','L'],['views','N'],['checkouts','Q'],['purchases','U'],['metaRevenue','W']]){
    const value=['spend','metaRevenue'].includes(key)?cents(r[col]):integer(r[col]);
    ad[key]+=value;week[key]+=value;
  }
  ads.set(r.C,ad);
}
for(const r of salesRecords){
  assert(['Completo','Aprovado'].includes(r.B),'Status Hotmart inesperado');
  week.statuses[r.B]=(week.statuses[r.B]||0)+1;
  assert(r.A&&!transactions.has(r.A),'Transação duplicada');transactions.add(r.A);
  const match=String(r.C).match(/^(\d{2})\/(\d{2})\/(\d{4}) /);
  assert(match,'Data Hotmart inválida');
  const date=`${match[3]}-${match[2]}-${match[1]}`;
  assert(daily.has(date),'Venda fora do período');
  assert(['BRL','USD'].includes(r.P),'Moeda inesperada');
  assert(r.S==='Produtor','Papel Hotmart inesperado');
  const gross=cents(r.Q),net=cents(r.R),name=r.G,currency=r.P;
  const product=products.get(name)||{name,gross:0,net:0,sales:0,brlSales:0,usdGross:0,usdNet:0,usdSales:0};
  for(const item of [week,product,daily.get(date)]){
    item.sales++;
    item[currency==='BRL'?'gross':'usdGross']+=gross;
    item[currency==='BRL'?'net':'usdNet']+=net;
    item[currency==='BRL'?'brlSales':'usdSales']++;
  }
  products.set(name,product);
}
week.ads=[...ads.values()];week.products=[...products.values()];week.daily=[...daily.values()];
assert(week.products.reduce((s,p)=>s+p.gross,0)===week.gross,'Produtos não conciliam');
assert(week.daily.reduce((s,d)=>s+d.net,0)===week.net,'Dias não conciliam');
if(outputPath)writeFileSync(outputPath,JSON.stringify(week));
console.log(JSON.stringify({start,end,ads:adsRecords.length,transactions:week.sales,spend:week.spend,gross:week.gross,net:week.net,usdSales:week.usdSales,usdGross:week.usdGross,usdNet:week.usdNet,metaPurchases:week.purchases,products:week.products.length}));
