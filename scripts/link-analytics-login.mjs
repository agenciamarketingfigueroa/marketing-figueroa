// Link the encrypted Analytics package to the existing administrator login.
// Input via stdin: JSON {password, analyticsKey}. Never write either secret to Git.
import {readFileSync,writeFileSync} from 'node:fs';
import {createCipheriv,createDecipheriv,pbkdf2Sync,randomBytes} from 'node:crypto';
const input=await new Promise((resolve,reject)=>{let text='';process.stdin.setEncoding('utf8');process.stdin.on('data',chunk=>text+=chunk);process.stdin.on('end',()=>resolve(JSON.parse(text)));process.stdin.on('error',reject);});
const path='assets/access/felipe-figueroa.json';
const account=JSON.parse(readFileSync(path,'utf8'));
const accountKey=pbkdf2Sync('felipe figueroa\n'+input.password,Buffer.from(account.salt,'base64'),account.iterations,32,'sha256');
function open(envelope,key) {
  const bytes=Buffer.from(envelope.data,'base64'),decipher=createDecipheriv('aes-256-gcm',key,Buffer.from(envelope.iv,'base64'));
  decipher.setAuthTag(bytes.subarray(-16));
  return JSON.parse(Buffer.concat([decipher.update(bytes.subarray(0,-16)),decipher.final()]).toString('utf8'));
}
let payload;
try {payload=open(account,accountKey);}catch {throw Error('A senha não abre o administrador. Nenhum arquivo foi alterado.');}
if(payload.role!=='master'||!payload.reportKey)throw Error('Conta de administrador inválida.');
const envelope=JSON.parse(readFileSync('assets/reports/manual-analytics.enc.json','utf8'));
const report=open(envelope,pbkdf2Sync(input.analyticsKey,Buffer.from(envelope.salt,'base64'),envelope.iterations,32,'sha256'));
if(report.dataset?.mode!=='manual')throw Error('Relatório manual inválido.');
payload.analyticsKey=input.analyticsKey;
const iv=randomBytes(12),cipher=createCipheriv('aes-256-gcm',accountKey,iv);
const bytes=Buffer.concat([cipher.update(JSON.stringify(payload),'utf8'),cipher.final(),cipher.getAuthTag()]);
const next={...account,iv:iv.toString('base64'),data:bytes.toString('base64')};
const verified=open(next,accountKey);
if(verified.reportKey!==payload.reportKey||verified.analyticsKey!==input.analyticsKey)throw Error('Falha na conferência.');
writeFileSync(path,JSON.stringify(next)+'\n');
console.log('Analytics vinculado à senha atual do administrador. Outros acessos preservados.');
