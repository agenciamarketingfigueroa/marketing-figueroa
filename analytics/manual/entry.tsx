import {createRoot} from 'react-dom/client';
import {Dashboard} from '../src/components/dashboard';
import type {Dataset,FollowerSnapshot} from '../src/lib/domain';
import {bindLogin,session,logout,type Session} from '@portal';
import {seal,unseal} from './crypto';

const element=<T extends HTMLElement>(id:string)=>document.getElementById(id) as T;
const supplementStorage='figueroa-analytics-followers-v1';
const root=createRoot(element('dashboard'));
let expiryTimer:ReturnType<typeof setTimeout>;
function followersFrom(value:unknown):FollowerSnapshot[] {
  const data=value as {type?:string;followers?:FollowerSnapshot[]};
  if(data?.type!=='figueroa-manual-followers-v1'||!Array.isArray(data.followers)||data.followers.length>10000)throw Error('INVALID_FOLLOWERS');
  const keys=new Set<string>();
  for(const row of data.followers) {
    if(!/^[a-z0-9._]{1,30}$/.test(row.username)||row.accountId!=='manual-instagram-'+row.username||!/^\d{4}-\d{2}-\d{2}$/.test(row.date)||!Number.isFinite(Date.parse(row.date))||!Number.isSafeInteger(row.followers)||row.followers<0||!Number.isFinite(Date.parse(row.observedAt)))throw Error('INVALID_FOLLOWERS');
    const id=row.accountId+row.date;if(keys.has(id))throw Error('DUPLICATE_FOLLOWERS');keys.add(id);
  }
  return data.followers;
}
async function unlock(passphrase:string) {
  if(session()?.role!=='master')throw Error('SESSION');
  const response=await fetch(new URL('assets/reports/manual-analytics.enc.json',document.baseURI),{cache:'no-store'});
  if(!response.ok)throw Error('NETWORK');
  const report=await unseal(await response.json(),passphrase) as {dataset:Dataset};
  if(report.dataset?.mode!=='manual'||!report.dataset.manualPeriods?.length)throw Error('INVALID_REPORT');
  const data=report.dataset;
  const saved=localStorage.getItem(supplementStorage);
  let manualNotice='';
  if(saved)try {data.followers=followersFrom(await unseal(JSON.parse(saved),passphrase));}
  catch {manualNotice='O relatório foi aberto, mas os registros locais de seguidores não puderam ser lidos. Restaure sua cópia de registros na aba Instagram. Salvar novos registros substituirá a cópia local.';}
  sessionStorage.removeItem('figueroa-analytics-key-v1');
  const assertSession=()=>{if(session()?.role!=='master') {logout();throw Error('SESSION');}};
  const save=async(followers:FollowerSnapshot[])=>{assertSession();const envelope=await seal({type:'figueroa-manual-followers-v1',followers},passphrase);assertSession();localStorage.setItem(supplementStorage,JSON.stringify(envelope));data.followers=followers;};
  const download=async()=>{
    assertSession();const envelope=await seal({type:'figueroa-manual-followers-v1',followers:data.followers??[]},passphrase);
    const url=URL.createObjectURL(new Blob([JSON.stringify(envelope)],{type:'application/json'}));const a=document.createElement('a');a.href=url;a.download='analytics-seguidores.enc.json';a.click();setTimeout(()=>URL.revokeObjectURL(url),1000);
  };
  const restore=async(file:File)=>{assertSession();if(file.size>5_000_000)throw Error('FILE_SIZE');return followersFrom(await unseal(JSON.parse(await file.text()),passphrase));};
  const periods=data.manualPeriods!;
  root.render(<Dashboard initialData={data} initialStart={periods[0].start} initialEnd={periods.at(-1)!.end} manualActions={{save,download,restore}} manualNotice={manualNotice}/>);
  element('access-gate').hidden=true;element('dashboard').hidden=false;
}
async function open(active:Session) {
  if(active.role!=='master')throw Error('ROLE');
  if(!active.analyticsKey) {
    element('access-gate').hidden=false;
    document.querySelector<HTMLElement>('[data-login-feedback]')!.textContent='Entre novamente com sua senha para abrir o Analytics.';
    return;
  }
  clearTimeout(expiryTimer);expiryTimer=setTimeout(()=>{root.unmount();logout();},Math.max(0,active.expires-Date.now()));
  await unlock(active.analyticsKey);
}
bindLogin(open,{requiredRole:'master'});
const active=session();if(active)void open(active).catch(()=>{
  element('access-gate').hidden=false;
  document.querySelector<HTMLElement>('[data-login-feedback]')!.textContent='Não foi possível carregar o relatório. Confira a conexão e tente entrar novamente.';
});
window.addEventListener('pageshow',()=>{if(!element('dashboard').hidden&&!session()){root.unmount();logout();}});
