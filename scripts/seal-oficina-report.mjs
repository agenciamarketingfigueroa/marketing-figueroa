import {readFileSync,writeFileSync,existsSync,renameSync,mkdirSync} from 'node:fs';
import {createDecipheriv,createCipheriv,pbkdf2Sync,randomBytes} from 'node:crypto';
import {resolve,dirname} from 'node:path';
import {createInterface} from 'node:readline';
import {combineReports} from '../assets/scripts/operation-report.js';

const root=resolve(import.meta.dirname,'..');
const inputPath=process.argv[2];
if(!inputPath)throw Error('Use: seal-oficina-report.mjs <semana-agregada.json> (senha da Mvave ou do administrador via stdin)');
const line=createInterface({input:process.stdin,terminal:false});
const password=await new Promise(resolve=>line.once('line',resolve));
line.close();

function open(sealed,key){
  const bytes=Buffer.from(sealed.data,'base64');
  const decipher=createDecipheriv('aes-256-gcm',key,Buffer.from(sealed.iv,'base64'));
  decipher.setAuthTag(bytes.subarray(-16));
  return JSON.parse(Buffer.concat([decipher.update(bytes.subarray(0,-16)),decipher.final()]).toString('utf8'));
}
function seal(value,key){
  const iv=randomBytes(12),cipher=createCipheriv('aes-256-gcm',key,iv);
  const bytes=Buffer.concat([cipher.update(JSON.stringify(value),'utf8'),cipher.final(),cipher.getAuthTag()]);
  return {version:1,iv:iv.toString('base64'),data:bytes.toString('base64')};
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
if(!reportKey)throw Error('A senha não abriu uma conta existente; nenhum relatório foi alterado.');

const incoming=JSON.parse(readFileSync(inputPath,'utf8'));
const additions=Array.isArray(incoming.weeks)?incoming.weeks:[incoming];
if(incoming.weeks&&incoming.client?.id!=='oficina-do-violao')throw Error('Cliente do agregado incompatível');
if(!additions.length)throw Error('Nenhum período no agregado');
for(const week of additions){
  const days=Math.round((Date.parse(week.end)-Date.parse(week.start))/86400000)+1;
  if(!/^\d{4}-\d{2}-\d{2}$/.test(week.start)||week.id!==week.start||week.days!==days||days<1||days>7||week.daily?.length!==days||week.sources?.length!==2||!Array.isArray(week.ads)||!Array.isArray(week.products))throw Error('Agregado semanal incompleto');
  if(week.daily.some((row,index)=>row.date!==new Date(Date.parse(week.start)+index*86400000).toISOString().slice(0,10)))throw Error('Série diária inconsistente');
  if(week.products.reduce((sum,row)=>sum+row.gross,0)!==week.gross||week.daily.reduce((sum,row)=>sum+row.net,0)!==week.net)throw Error('Totais do agregado não conciliam');
}
const reportPath=resolve(root,'assets/reports/oficina-do-violao/report.enc.json');
const report=existsSync(reportPath)?open(JSON.parse(readFileSync(reportPath,'utf8')),reportKey):{
  schemaVersion:1,
  client:{id:'oficina-do-violao',name:'Oficina do Violão',segment:'Infoprodutos',platforms:['Meta Ads','Hotmart']},
  weeks:[]
};
if(report.schemaVersion!==1||report.client?.id!=='oficina-do-violao')throw Error('Relatório existente incompatível');
report.weeks.push(...additions);
report.weeks.sort((a,b)=>a.start.localeCompare(b.start));
for(let i=1;i<report.weeks.length;i++)if(report.weeks[i].start<=report.weeks[i-1].end)throw Error('Períodos duplicados ou sobrepostos');
const hashes=report.weeks.flatMap(week=>week.sources.map(source=>source.sha256));
if(new Set(hashes).size!==hashes.length)throw Error('Arquivo de origem repetido');
const mvavePath=resolve(root,'assets/reports/mvave-br/report.enc.json');
combineReports(open(JSON.parse(readFileSync(mvavePath,'utf8')),reportKey),report);
mkdirSync(dirname(reportPath),{recursive:true});
const temporary=reportPath+'.tmp';
writeFileSync(temporary,JSON.stringify(seal(report,reportKey))+'\n');
const verify=open(JSON.parse(readFileSync(temporary,'utf8')),reportKey);
if(verify.weeks.length!==report.weeks.length||verify.weeks.at(-1).end!==report.weeks.at(-1).end)throw Error('Falha ao verificar o pacote');
renameSync(temporary,reportPath);
console.log(JSON.stringify({client:'oficina-do-violao',periods:report.weeks.length,files:hashes.length,end:report.weeks.at(-1).end,accessEnvelopes:'preserved'}));
