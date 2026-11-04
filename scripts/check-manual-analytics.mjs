import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {webcrypto} from 'node:crypto';

const [file]=process.argv.slice(2);
assert.ok(file,'Use: chave | node scripts/check-manual-analytics.mjs <arquivo.enc.json>');
const passphrase=await new Promise((resolve,reject)=>{let input='';process.stdin.setEncoding('utf8');process.stdin.on('data',chunk=>input+=chunk);process.stdin.on('end',()=>resolve(input.trim()));process.stdin.on('error',reject);});
const sealed=JSON.parse(readFileSync(file,'utf8'));
const decode=value=>Buffer.from(value,'base64');
const material=await webcrypto.subtle.importKey('raw',new TextEncoder().encode(passphrase),'PBKDF2',false,['deriveKey']);
const key=await webcrypto.subtle.deriveKey({name:'PBKDF2',salt:decode(sealed.salt),iterations:sealed.iterations,hash:'SHA-256'},material,{name:'AES-GCM',length:256},false,['decrypt']);
const report=JSON.parse(new TextDecoder().decode(await webcrypto.subtle.decrypt({name:'AES-GCM',iv:decode(sealed.iv)},key,decode(sealed.data))));
assert.equal(report.schemaVersion,1);assert.equal(report.mode,'manual');assert.equal(report.client.id,'mvave-br');
assert.ok(report.periods.length>0);
for(const p of report.periods){
  const only=(value,allowed)=>assert.deepEqual(Object.keys(value).sort(),allowed.sort());
  only(p,['id','start','end','days','month','spend','impressions','metaPurchases','gross','net','sales','brlSales','usdGross','usdNet','usdSales','sourceSignals','ads','products','daily','statuses','payments','sources']);
  assert.equal(p.products.reduce((sum,r)=>sum+r.gross,0),p.gross);
  assert.equal(p.daily.reduce((sum,r)=>sum+r.net,0),p.net);
  assert.equal(p.ads.reduce((sum,r)=>sum+r.spend,0),p.spend);
  assert.equal(p.daily.length,p.days);
  assert.equal(p.sources.length,2);
  assert.equal(Object.values(p.payments).reduce((sum,n)=>sum+n,0),p.sales);
  for(const row of p.daily)only(row,['date','gross','net','sales','brlSales','usdGross','usdNet','usdSales']);
  for(const row of p.ads)only(row,['name','spend','impressions','purchases']);
  for(const row of p.products)only(row,['name','gross','net','sales','brlSales','usdGross','usdNet','usdSales']);
  for(const row of p.sources)only(row,['name','rows','sha256']);
}
const forbidden=['Email do(a) Comprador(a)','Telefone','Documento','Transação do Produto Principal','Código da transação'];
for(const term of forbidden)assert.ok(!JSON.stringify(report).includes(term),`Campo pessoal inesperado: ${term}`);
console.log(JSON.stringify({periods:report.periods.map(p=>p.month),sales:report.periods.reduce((sum,p)=>sum+p.sales,0),files:report.periods.flatMap(p=>p.sources).length,integrity:'ok'}));
