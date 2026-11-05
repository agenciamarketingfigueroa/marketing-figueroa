// Explicit manifest dates define coverage. No source workbooks or buyer data are published.
import {readFileSync,writeFileSync,renameSync} from 'node:fs';
import {basename,resolve} from 'node:path';
import {spawnSync} from 'node:child_process';
import {createCipheriv,createDecipheriv,createHash,pbkdf2Sync,randomBytes} from 'node:crypto';
import {importDailyReport} from './manual-daily-import.mjs';
const [manifestPath,reportPath,flag]=process.argv.slice(2);
if(!manifestPath||!reportPath||(flag&&flag!=='--dry-run'))throw Error('Use: chave | node scripts/import-manual-daily.mjs <manifest.json> <report.enc.json> [--dry-run]');
const passphrase=await new Promise(resolve=>{let value='';process.stdin.setEncoding('utf8');process.stdin.on('data',c=>value+=c);process.stdin.on('end',()=>resolve(value.trim()));});
if(passphrase.length<20)throw Error('Chave inválida');
const envelope=JSON.parse(readFileSync(reportPath,'utf8')),bytes=Buffer.from(envelope.data,'base64');
const decipher=createDecipheriv('aes-256-gcm',pbkdf2Sync(passphrase,Buffer.from(envelope.salt,'base64'),envelope.iterations,32,'sha256'),Buffer.from(envelope.iv,'base64'));decipher.setAuthTag(bytes.subarray(-16));
const previous=JSON.parse(Buffer.concat([decipher.update(bytes.subarray(0,-16)),decipher.final()]));
const manifest=JSON.parse(readFileSync(manifestPath,'utf8'));
function readBatch(batch) {
  if(!/^\d{4}-\d{2}-\d{2}$/.test(batch.start)||!/^\d{4}-\d{2}-\d{2}$/.test(batch.end)||batch.start>batch.end)throw Error('Período inválido no manifesto');
  const result=spawnSync('powershell.exe',['-NoProfile','-ExecutionPolicy','Bypass','-File',resolve(import.meta.dirname,'xlsx-rows.ps1'),batch.path],{encoding:'utf8',maxBuffer:50e6});
  if(result.status!==0)throw Error('Falha ao ler '+basename(batch.path));
  const rows=JSON.parse(result.stdout);
  return {...batch,rows,source:{name:basename(batch.path),rows:rows.length-1,sha256:createHash('sha256').update(readFileSync(batch.path)).digest('hex')}};
}
const report=importDailyReport(previous,manifest.meta.map(readBatch),manifest.hotmart.map(readBatch));
const summary={mode:flag?'dry-run':'saved',periods:report.periods.map(p=>({month:p.month,start:p.start,end:p.end,spend:p.spend,purchases:p.metaPurchases,sales:p.sales,gross:p.gross,net:p.net})),dailyRows:report.dataset.insights.length,aggregateRows:report.dataset.manualMetaAggregates.length,instagramThrough:report.dataset.instagramDaily?.at(-1)?.date};
if(!flag) {
  const salt=randomBytes(16),iv=randomBytes(12),key=pbkdf2Sync(passphrase,salt,600000,32,'sha256'),cipher=createCipheriv('aes-256-gcm',key,iv);
  const encrypted=Buffer.concat([cipher.update(JSON.stringify(report)),cipher.final(),cipher.getAuthTag()]);
  const next={version:1,kdf:'PBKDF2-SHA256',iterations:600000,salt:salt.toString('base64'),iv:iv.toString('base64'),data:encrypted.toString('base64')};
  // Verify encryption before the atomic replacement.
  const verify=createDecipheriv('aes-256-gcm',key,iv);verify.setAuthTag(encrypted.subarray(-16));
  if(Buffer.concat([verify.update(encrypted.subarray(0,-16)),verify.final()]).toString()!==JSON.stringify(report))throw Error('Falha na verificação');
  writeFileSync(reportPath+'.tmp',JSON.stringify(next)+'\n');renameSync(reportPath+'.tmp',reportPath);
}
console.log(JSON.stringify(summary));
