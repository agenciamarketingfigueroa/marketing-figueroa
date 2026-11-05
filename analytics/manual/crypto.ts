export interface Envelope {version:number;kdf:string;iterations:number;salt:string;iv:string;data:string}
const decode=(s:string)=>Uint8Array.from(atob(s),c=>c.charCodeAt(0));
const encode=(bytes:Uint8Array)=>btoa(Array.from(bytes,b=>String.fromCharCode(b)).join(''));
async function key(passphrase:string,salt:Uint8Array<ArrayBuffer>,iterations:number) {
  const material=await crypto.subtle.importKey('raw',new TextEncoder().encode(passphrase),'PBKDF2',false,['deriveKey']);
  return crypto.subtle.deriveKey({name:'PBKDF2',salt,iterations,hash:'SHA-256'},material,{name:'AES-GCM',length:256},false,['encrypt','decrypt']);
}
export async function unseal(envelope:Envelope,passphrase:string):Promise<unknown> {
  if(envelope.version!==1||envelope.kdf!=='PBKDF2-SHA256'||envelope.iterations!==600000)throw Error('INVALID_ENVELOPE');
  const result=await crypto.subtle.decrypt({name:'AES-GCM',iv:decode(envelope.iv)},await key(passphrase,decode(envelope.salt),envelope.iterations),decode(envelope.data));
  return JSON.parse(new TextDecoder().decode(result));
}
export async function seal(value:unknown,passphrase:string):Promise<Envelope> {
  const salt=crypto.getRandomValues(new Uint8Array(16)),iv=crypto.getRandomValues(new Uint8Array(12));
  const bytes=await crypto.subtle.encrypt({name:'AES-GCM',iv},await key(passphrase,salt,600000),new TextEncoder().encode(JSON.stringify(value)));
  return {version:1,kdf:'PBKDF2-SHA256',iterations:600000,salt:encode(salt),iv:encode(iv),data:encode(new Uint8Array(bytes))};
}
