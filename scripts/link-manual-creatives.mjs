// Preview images are copied into this site. The source repository is read-only.
import {readFileSync,readdirSync,writeFileSync,mkdirSync,realpathSync} from 'node:fs';
import {resolve,join,relative,sep} from 'node:path';
import {createHash,createDecipheriv,createCipheriv,pbkdf2Sync,randomBytes} from 'node:crypto';
import sharp from '../analytics/node_modules/sharp/dist/index.mjs';
const [sourceRoot,reportPath]=process.argv.slice(2);
if(!sourceRoot||!reportPath)throw Error('Use: node scripts/link-manual-creatives.mjs <repositorio-mvave> <relatorio.enc.json>');
const passphrase=await new Promise(resolve=>{let s='';process.stdin.setEncoding('utf8');process.stdin.on('data',c=>s+=c);process.stdin.on('end',()=>resolve(s.trim()));});
const root=realpathSync(sourceRoot),envelope=JSON.parse(readFileSync(reportPath,'utf8')),raw=Buffer.from(envelope.data,'base64');
const key=pbkdf2Sync(passphrase,Buffer.from(envelope.salt,'base64'),envelope.iterations,32,'sha256'),decipher=createDecipheriv('aes-256-gcm',key,Buffer.from(envelope.iv,'base64'));decipher.setAuthTag(raw.subarray(-16));
const report=JSON.parse(Buffer.concat([decipher.update(raw.subarray(0,-16)),decipher.final()]));
const originals='assets/creativos-instagram/finais';
const base=new Map(readdirSync(join(root,originals)).filter(f=>/^\d{2}-.+\.png$/.test(f)).map(file=>['C'+file.slice(0,2),originals+'/'+file]));
const docs=readFileSync(join(root,'CRIATIVOS-MVAVE-BR-60.md'),'utf8');
for(const section of docs.split(/^# /m)){const code=section.match(/^(C[GBV]\d{2})\s/),file=section.match(/\*\*Arquivo:\*\* `([^`]+)`/);if(code&&file)base.set(code[1],file[1]);}
const output='assets/images/analytics-creatives/linked';mkdirSync(output,{recursive:true});
const cached=new Map(),creatives=[],missing=new Set();
for(const row of report.dataset.insights) {
  if(creatives.some(c=>c.accountId===row.accountId&&c.adId===row.adId))continue;
  const code=row.ad.toUpperCase().match(/^\[?(C(?:G|B|V)?\d{2})(?:\]|\s*\|)/)?.[1];
  const source=code&&base.get(code);
  if(!source){missing.add(row.ad);continue;}
  const abs=realpathSync(resolve(root,source));if(!abs.startsWith(root+sep))throw Error('Caminho de criativo fora do repositório');
  let imageUrl=cached.get(source);
  if(!imageUrl){const hash=createHash('sha256').update(source).digest('hex').slice(0,16);imageUrl=output+'/'+hash+'.webp';await sharp(abs).resize({width:600,withoutEnlargement:true}).webp({quality:80}).toFile(imageUrl);cached.set(source,imageUrl);}
  creatives.push({accountId:row.accountId,adId:row.adId,creativeId:code,name:row.ad,imageUrl,videoId:null,kind:'repository',sourcePath:relative(root,abs).replaceAll('\\','/'),matchBasis:'Código '+code+' · arquivo do repositório'});
}
report.dataset.creatives=creatives;
const salt=randomBytes(16),iv=randomBytes(12),newKey=pbkdf2Sync(passphrase,salt,600000,32,'sha256'),cipher=createCipheriv('aes-256-gcm',newKey,iv);
const encrypted=Buffer.concat([cipher.update(JSON.stringify(report)),cipher.final(),cipher.getAuthTag()]);writeFileSync(reportPath,JSON.stringify({version:1,kdf:'PBKDF2-SHA256',iterations:600000,salt:salt.toString('base64'),iv:iv.toString('base64'),data:encrypted.toString('base64')})+'\n');
console.log(JSON.stringify({linkedAds:creatives.length,previewFiles:cached.size,unmatchedNames:missing.size}));
