import {readFile,writeFile,mkdir} from 'node:fs/promises';
import {randomBytes,pbkdf2Sync,createCipheriv} from 'node:crypto';
import {resolve,dirname} from 'node:path';

// Call from a private import session. Never put credentials or unencrypted source exports in the repository.
export async function sealReport({input,root,accounts}) {
  const report=JSON.parse(await readFile(input,'utf8'));
  if(report.schemaVersion!==1||report.client.id!=='mvave-br')throw new Error('Unsupported report');
  const key=randomBytes(32);
  const seal=(payload,encryptionKey)=>{
    const iv=randomBytes(12),cipher=createCipheriv('aes-256-gcm',encryptionKey,iv);
    const ciphertext=Buffer.concat([cipher.update(JSON.stringify(payload),'utf8'),cipher.final(),cipher.getAuthTag()]);
    return {version:1,iv:iv.toString('base64'),data:ciphertext.toString('base64')};
  };
  const save=async(relative,value)=>{const target=resolve(root,relative);await mkdir(dirname(target),{recursive:true});await writeFile(target,JSON.stringify(value)+'\n');};
  await save('assets/reports/mvave-br/report.enc.json',seal(report,key));
  for(const account of accounts){
    const salt=randomBytes(16),iterations=600000;
    const normalized=account.username.normalize('NFD').replace(/[\u0300-\u036f]/g,'').trim().replace(/\s+/g,' ').toLowerCase();
    const accountKey=pbkdf2Sync(normalized+'\n'+account.password,salt,iterations,32,'sha256');
    const payload={name:account.username,role:account.role,client:'mvave-br',reportKey:key.toString('base64')};
    if(account.role==='master')payload.legacyClients=['marketing-figueroa-client-victor-lopes'];
    await save(`assets/access/${account.id}.json`,{...seal(payload,accountKey),salt:salt.toString('base64'),iterations});
  }
  return {periods:report.weeks.length,files:report.weeks.flatMap(w=>w.sources).length};
}
