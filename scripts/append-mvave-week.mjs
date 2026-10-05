import {readFileSync,writeFileSync,renameSync} from 'node:fs';
import {createDecipheriv,createCipheriv,pbkdf2Sync,randomBytes} from 'node:crypto';
import {resolve} from 'node:path';
import {createInterface} from 'node:readline';

const root=resolve(import.meta.dirname,'..');
const weekPath=process.argv[2];
if(!weekPath)throw Error('Use: append-mvave-week.mjs <aggregated-week.json>');
const line=createInterface({input:process.stdin,terminal:false});
const password=await new Promise(resolve=>line.once('line',resolve));
line.close();
function open(sealed,key){
  const bytes=Buffer.from(sealed.data,'base64');
  const decipher=createDecipheriv('aes-256-gcm',key,Buffer.from(sealed.iv,'base64'));
  decipher.setAuthTag(bytes.subarray(-16));
  return JSON.parse(Buffer.concat([decipher.update(bytes.subarray(0,-16)),decipher.final()]).toString('utf8'));
}
let reportKey;
for(const [id,username] of [['mvave-br','mvave br'],['felipe-figueroa','felipe figueroa']]){
  const envelope=JSON.parse(readFileSync(resolve(root,`assets/access/${id}.json`),'utf8'));
  const key=pbkdf2Sync(username+'\n'+password,Buffer.from(envelope.salt,'base64'),envelope.iterations,32,'sha256');
  try{
    const account=open(envelope,key);
    if(account.client==='mvave-br'&&account.reportKey){reportKey=Buffer.from(account.reportKey,'base64');break;}
  }catch{}
}
if(!reportKey)throw Error('A senha não abre nenhum dos acessos atuais; nenhum arquivo foi alterado.');
const reportPath=resolve(root,'assets/reports/mvave-br/report.enc.json');
const report=open(JSON.parse(readFileSync(reportPath,'utf8')),reportKey);
const week=JSON.parse(readFileSync(weekPath,'utf8'));
if(report.schemaVersion!==1||report.client.id!=='mvave-br')throw Error('Relatório incompatível');
if(report.weeks.length!==6||report.weeks.at(-1).end!=='2026-09-27'||week.start!=='2026-09-28'||week.end!=='2026-10-04')throw Error('Histórico ou semana fora da sequência esperada');
if(week.sources.length!==2||week.daily.length!==7||week.days!==7)throw Error('Agregados incompletos');
report.weeks.push(week);
const iv=randomBytes(12),cipher=createCipheriv('aes-256-gcm',reportKey,iv);
const bytes=Buffer.concat([cipher.update(JSON.stringify(report),'utf8'),cipher.final(),cipher.getAuthTag()]);
const sealed={version:1,iv:iv.toString('base64'),data:bytes.toString('base64')};
const temporary=reportPath+'.tmp';
writeFileSync(temporary,JSON.stringify(sealed)+'\n');
const verify=open(JSON.parse(readFileSync(temporary,'utf8')),reportKey);
if(verify.weeks.length!==7||verify.weeks.at(-1).gross!==week.gross)throw Error('Falha na verificação do pacote');
renameSync(temporary,reportPath);
console.log(JSON.stringify({periods:verify.weeks.length,files:verify.weeks.flatMap(w=>w.sources).length,end:verify.weeks.at(-1).end,accessEnvelopes:'preserved'}));
