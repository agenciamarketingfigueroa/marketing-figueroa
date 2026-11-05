import {test} from 'node:test';
import assert from 'node:assert/strict';
import {mkdtempSync,mkdirSync,readFileSync,writeFileSync,rmSync} from 'node:fs';
import {tmpdir} from 'node:os';
import {join} from 'node:path';
import {fileURLToPath} from 'node:url';
import {createCipheriv,createDecipheriv,pbkdf2Sync,randomBytes} from 'node:crypto';
import {spawnSync} from 'node:child_process';
function seal(payload,secret) {
  const salt=randomBytes(16),iv=randomBytes(12),iterations=600000,key=pbkdf2Sync(secret,salt,iterations,32,'sha256');
  const cipher=createCipheriv('aes-256-gcm',key,iv);
  return {version:1,kdf:'PBKDF2-SHA256',iterations,salt:salt.toString('base64'),iv:iv.toString('base64'),data:Buffer.concat([cipher.update(JSON.stringify(payload)),cipher.final(),cipher.getAuthTag()]).toString('base64')};
}
test('vincula Analytics somente com senha correta e preserva acesso aos relatórios anteriores',()=>{
  const directory=mkdtempSync(join(tmpdir(),'figueroa-login-'));
  try {
    mkdirSync(join(directory,'assets/access'),{recursive:true});mkdirSync(join(directory,'assets/reports'),{recursive:true});
    const accountPath=join(directory,'assets/access/felipe-figueroa.json');
    const account={role:'master',reportKey:randomBytes(32).toString('base64'),legacyClients:['legacy']};
    writeFileSync(accountPath,JSON.stringify(seal(account,'felipe figueroa\nfixture-password')));
    writeFileSync(join(directory,'assets/reports/manual-analytics.enc.json'),JSON.stringify(seal({dataset:{mode:'manual'}},'fixture-analytics-key')));
    const run=password=>spawnSync(process.execPath,[fileURLToPath(new URL('./link-analytics-login.mjs',import.meta.url))],{cwd:directory,input:JSON.stringify({password,analyticsKey:'fixture-analytics-key'}),encoding:'utf8'});
    const before=readFileSync(accountPath,'utf8');assert.notEqual(run('wrong-password').status,0);assert.equal(readFileSync(accountPath,'utf8'),before);
    const result=run('fixture-password');assert.equal(result.status,0,result.stderr);
    const envelope=JSON.parse(readFileSync(accountPath,'utf8')),bytes=Buffer.from(envelope.data,'base64');
    const key=pbkdf2Sync('felipe figueroa\nfixture-password',Buffer.from(envelope.salt,'base64'),envelope.iterations,32,'sha256');
    const decipher=createDecipheriv('aes-256-gcm',key,Buffer.from(envelope.iv,'base64'));decipher.setAuthTag(bytes.subarray(-16));
    const actual=JSON.parse(Buffer.concat([decipher.update(bytes.subarray(0,-16)),decipher.final()]).toString('utf8'));
    assert.deepEqual(actual,{...account,analyticsKey:'fixture-analytics-key'});
    assert.ok(!readFileSync(accountPath,'utf8').includes('fixture-analytics-key'));
  }finally {rmSync(directory,{recursive:true,force:true});}
});
