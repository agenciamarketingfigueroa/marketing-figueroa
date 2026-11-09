import fs from 'node:fs';
import {resolve,join,relative,extname,basename} from 'node:path';
import {fileURLToPath} from 'node:url';
import assert from 'node:assert/strict';
import {hash,readRows,parseHotmart,parseMeta,parseInstagram,reconcile,classifyLinkedAdditions,check} from './core.mjs';
import {bridge,seal,unseal} from './importar.mjs';
import {generateReports} from './relatorios.mjs';
const root=resolve(fileURLToPath(new URL('..',import.meta.url)));
const walk=dir=>fs.readdirSync(dir,{withFileTypes:true}).flatMap(e=>e.isDirectory()?walk(join(dir,e.name)):[join(dir,e.name)]);
const write=(p,v)=>{fs.mkdirSync(resolve(p,'..'),{recursive:true});fs.writeFileSync(p+'.tmp',JSON.stringify(v,null,2)+'\n');fs.renameSync(p+'.tmp',p);};
const approved=o=>['APPROVED','COMPLETE'].includes(o.status);
const totals=d=>({orders:d.orders.length,approved:d.orders.filter(approved).length,grossBRL:d.orders.filter(o=>approved(o)&&o.currency==='BRL').reduce((s,o)=>s+o.gross,0),netBRL:d.orders.filter(o=>approved(o)&&o.currency==='BRL').reduce((s,o)=>s+(o.net??0),0),mediaRows:d.insights.length,spend:d.insights.reduce((s,i)=>s+i.spend,0),impressions:d.insights.every(i=>i.impressions!==null)?d.insights.reduce((s,i)=>s+i.impressions,0):null,instagramDays:d.instagramDaily?.length??0});

export function importFolder(folder,secret,{dryRun=false}={}){
  const directory=resolve(folder),products=JSON.parse(fs.readFileSync(join(root,'config/produtos_mvave_br.json'),'utf8'));
  const basePath=join(root,'dados/normalizados/base.json'),packagePath=resolve('assets/reports/manual-analytics.enc.json');
  const originalBase=JSON.parse(fs.readFileSync(basePath,'utf8')),previous=unseal(JSON.parse(fs.readFileSync(packagePath,'utf8')),secret);
  let base=structuredClone(originalBase);const staged=[],inventory=[],instagram=[],cache=join(root,'dados/leitura-lote');
  fs.mkdirSync(cache,{recursive:true});
  for(const path of walk(directory).filter(p=>/\.(xlsx?|csv)$/i.test(p)).sort()){
    const name=relative(directory,path).replaceAll('\\','/'),part=name.split('/')[0].toLowerCase();
    const provider=({hotmart:'hotmart',meta:'meta',instagram:'instagram'})[part];check(provider,'Pasta de origem não reconhecida: '+name);
    const raw=fs.readFileSync(path),digest=hash(raw);let parsed;
    if(provider==='instagram')parsed=parseInstagram(raw,digest);
    else{const cached=join(cache,digest+'.json'),rows=fs.existsSync(cached)?JSON.parse(fs.readFileSync(cached,'utf8')):readRows(path);if(!fs.existsSync(cached))write(cached,rows);parsed=provider==='meta'?parseMeta(rows,digest):parseHotmart(rows,products,digest);}
    check(parsed.length,'Arquivo sem linhas: '+name);
    const starts=parsed.map(r=>r.date??r.day??r.start).sort(),ends=parsed.map(r=>r.date??r.day??r.end).sort();
    const batch={provider,operation:'mvave-br',name,hash:digest,importedAt:new Date().toISOString(),start:starts[0],end:ends.at(-1),filters:'Exports diários fornecidos pelo responsável; filtros das plataformas não certificados',rows:parsed};
    inventory.push({name,hash:digest,provider,start:batch.start,end:batch.end,rows:parsed.length});
    if(provider==='instagram'){instagram.push(...parsed);if(!base.snapshots.some(s=>s.hash===digest)){const snap={...batch,rows:parsed.length,changes:[]};base.snapshots.push(snap);staged.push({path,batch:snap});}}
    else{const result=reconcile(base,batch);base=result.base;if(!result.duplicate)staged.push({path,batch:{...batch,rows:parsed.length,changes:result.changes}});}
  }
  base=classifyLinkedAdditions(base,products);
  const next=bridge(previous,base),d=next.dataset;
  delete d.intelligence;
  // Keep a review trail for rows explicitly outside the MVAVE BR policy. These
  // rows are not included in operational totals or customer exports.
  const reviewIds=new Set(base.orders.filter(o=>o.operation!=='mvave-br'||o.category==='REVISAR').map(o=>'ref-'+hash(o.transaction).slice(0,16)));
  d.excludedOperationOrders=[...new Map([...(previous.dataset.excludedOperationOrders??[]),...previous.dataset.orders.filter(o=>reviewIds.has(o.transaction))].map(o=>[o.transaction+'|'+o.productId,o])).values()].filter(o=>!d.orders.some(r=>r.transaction===o.transaction&&r.productId===o.productId));
  const ig=new Map((previous.dataset.instagramDaily??[]).map(r=>[r.date,{...r}])),seen=new Map();
  for(const r of instagram){const key=r.date+'|'+r.field;if(seen.has(key))check(seen.get(key)===r.value,'Exports Instagram conflitantes para '+key);seen.set(key,r.value);const row=ig.get(r.date)??{date:r.date};row[r.field]=r.value;ig.set(r.date,row);}
  for(const row of ig.values())for(const k of ['views','followers','interactions'])check(Number.isSafeInteger(row[k])&&row[k]>=0,'Instagram incompleto: '+row.date+' / '+k);
  d.instagramDaily=[...ig.values()].sort((a,b)=>a.date.localeCompare(b.date));d.instagramFollowersKind='new';
  const igSources=inventory.filter(f=>f.provider==='instagram').map(f=>({name:f.name,rows:f.rows,sha256:f.hash}));
  d.instagramSources=[...new Map([...(d.instagramSources??[]),...igSources].map(s=>[s.sha256,s])).values()];
  // Image association is retained only when an existing identity resolves to a
  // unique new identity. Names alone cannot reconnect assets or attribution.
  let remappedAssets=0,unresolvedAssets=0;
  d.creatives=(previous.dataset.creatives??[]).flatMap(c=>{
    if(d.insights.some(r=>r.accountId===c.accountId&&r.adId===c.adId))return [c];
    const old=[...previous.dataset.insights,...previous.dataset.manualMetaAggregates??[]].find(r=>r.accountId===c.accountId&&r.adId===c.adId);
    const matches=old?.exportAdId?[...new Set(d.insights.filter(r=>r.accountId===c.accountId&&r.exportAdId===old.exportAdId&&r.ad===old.ad).map(r=>r.adId))]:[];
    if(matches.length===1){remappedAssets++;return [{...c,adId:matches[0]}];}unresolvedAssets++;return [];
  });
  d.manualMetaIdPrecision=d.insights.some(i=>i.idPrecision!=='exact')?'rounded':'exact';
  check(new Set(d.orders.map(o=>o.accountId+'|'+o.transaction+'|'+o.productId)).size===d.orders.length,'Transações duplicadas no pacote');
  check(new Set(d.insights.map(r=>r.accountId+'|'+r.date+'|'+r.adId)).size===d.insights.length,'Identidades Meta duplicadas no pacote');
  const audit={at:new Date().toISOString(),files:inventory.length,newSnapshots:staged.length,byProvider:Object.fromEntries(['hotmart','meta','instagram'].map(p=>[p,inventory.filter(f=>f.provider===p).length])),sources:inventory,before:totals(previous.dataset),after:totals(d),normalizedOrders:base.orders.length,reviewOrders:base.orders.filter(o=>o.operation==='REVISAR'||o.category==='REVISAR').length,remappedAssets,unresolvedAssets,daily:[]};
  audit.instagramRevisions=instagram.flatMap(r=>{const old=previous.dataset.instagramDaily?.find(d=>d.date===r.date)?.[r.field]??null;return old===r.value?[]:[{date:r.date,field:r.field,before:old,after:r.value,source:r.source}];});
  for(const day of [...new Set(d.insights.map(r=>r.date))].sort()){
    const before=previous.dataset.insights.filter(r=>r.date===day),after=d.insights.filter(r=>r.date===day),o=d.orders.filter(o=>o.purchasedAt.startsWith(day)&&approved(o)&&o.currency==='BRL');
    audit.daily.push({day,priorSpend:before.reduce((s,r)=>s+r.spend,0),spend:after.reduce((s,r)=>s+r.spend,0),gross:o.reduce((s,r)=>s+r.gross,0),net:o.reduce((s,r)=>s+(r.net??0),0),active:after.filter(r=>r.status==='ACTIVE').length,rows:after.length});
  }
  write(join(root,'relatorios/consolidados/auditoria-pasta-diaria'+(dryRun?'-previa':'')+'.json'),audit);
  if(!dryRun){
    const envelope=seal(next,secret);assert.deepEqual(unseal(envelope,secret),next);
    const timestamp=Date.now();fs.copyFileSync(packagePath,join(root,'dados/snapshots/site-pre-pasta-'+timestamp+'.enc.json'));fs.copyFileSync(basePath,join(root,'dados/snapshots/base-pre-pasta-'+timestamp+'.json'));
    for(const {path,batch} of staged){const dest=join(root,'dados/originais',batch.provider,batch.hash+extname(path));fs.mkdirSync(resolve(dest,'..'),{recursive:true});if(!fs.existsSync(dest))fs.copyFileSync(path,dest);check(hash(fs.readFileSync(dest))===batch.hash,'Hash da cópia divergiu');write(join(root,'dados/snapshots',batch.hash+'.json'),{...batch,original:dest});}
    write(basePath,base);write(packagePath,envelope);
    write(join(root,'dados/normalizados/instagram.json'),instagram);
    generateReports(base,root);
  }
  return {dryRun,files:audit.files,newSnapshots:staged.length,byProvider:audit.byProvider,before:audit.before,after:audit.after,normalizedOrders:audit.normalizedOrders,reviewOrders:audit.reviewOrders,remappedAssets,unresolvedAssets,lastDay:audit.daily.at(-1)};
}
if(process.argv[1]&&resolve(process.argv[1])===fileURLToPath(import.meta.url)){
  const [folder,...flags]=process.argv.slice(2);check(folder,'Use: importar-pasta.mjs <pasta> [--dry-run], chave via stdin');
  const secret=await new Promise(r=>{let s='';process.stdin.setEncoding('utf8');process.stdin.on('data',v=>s+=v);process.stdin.on('end',()=>r(s.trim()));});check(secret.length>=20,'Chave existente necessária via stdin');
  console.log(JSON.stringify(importFolder(folder,secret,{dryRun:flags.includes('--dry-run')}),null,2));
}
