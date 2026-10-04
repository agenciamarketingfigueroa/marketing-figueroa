import {bindLogin,session,logout} from './portal-auth.js';
const master=document.querySelector('[data-master-content]');
function proceed(active){
  if(master){
    if(active.role!=='master'){
      document.querySelector('[data-login-feedback]').textContent='Esta área é exclusiva para administradores. Acesse seu projeto pela Área do Cliente.';
      return;
    }
    document.querySelector('[data-master-gate]').hidden=true;
    master.hidden=false;
    document.querySelector('[data-master-name]').textContent=active.name;
    // Existing Victor pages already use this browser-only gate; keep their original password working.
    (active.legacyClients||[]).forEach(key=>sessionStorage.setItem(key,'open'));
    setTimeout(logout,Math.max(0,active.expires-Date.now()));
  }else{
    location.href=new URL(active.role==='master'?'area-interna.html':'clientes/mvave-br/index.html',document.baseURI).href;
  }
}
bindLogin(proceed, {requiredRole: master ? 'master' : undefined});
if(master&&session())proceed(session());
window.addEventListener('pageshow',()=>{if(master&&!master.hidden&&!session())logout();});
