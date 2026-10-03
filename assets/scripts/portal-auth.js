// Static pilot: encrypted aggregates, session-only keys. See README for security limits.
const sessionName = 'figueroa-portal-v1';
const accounts = {'mvave br':'mvave-br', 'felipe figueroa':'felipe-figueroa'};
const decode = value => Uint8Array.from(atob(value), c => c.charCodeAt(0));
export const normalize = value => value.normalize('NFD').replace(/[\u0300-\u036f]/g, '').trim().replace(/\s+/g, ' ').toLowerCase();
export function session() {
  try {
    const value = JSON.parse(sessionStorage.getItem(sessionName));
    if (value?.expires > Date.now()) return value;
  } catch {}
  sessionStorage.removeItem(sessionName);
  return null;
}
export function logout() {
  sessionStorage.removeItem(sessionName);
  sessionStorage.removeItem('marketing-figueroa-client-victor-lopes');
  location.href = new URL('area-cliente.html', document.baseURI).href;
}
async function readJson(url) {
  const response = await fetch(new URL(url, document.baseURI), {cache:'no-store'});
  if (!response.ok) throw new Error('network');
  return response.json();
}
async function decrypt(envelope, key) {
  const raw = await crypto.subtle.decrypt({name:'AES-GCM',iv:decode(envelope.iv)},key,decode(envelope.data));
  return JSON.parse(new TextDecoder().decode(raw));
}
export async function reportData(active = session()) {
  if (!active?.reportKey) throw new Error('session');
  const key = await crypto.subtle.importKey('raw',decode(active.reportKey),'AES-GCM',false,['decrypt']);
  return decrypt(await readJson('assets/reports/mvave-br/report.enc.json'),key);
}
export async function login(username, password) {
  const normalized = normalize(username);
  const id = accounts[normalized];
  if (!id) throw new Error('credentials');
  const envelope = await readJson(`assets/access/${id}.json`);
  const material = await crypto.subtle.importKey('raw',new TextEncoder().encode(normalized+'\n'+password),'PBKDF2',false,['deriveKey']);
  const key = await crypto.subtle.deriveKey({name:'PBKDF2',salt:decode(envelope.salt),iterations:envelope.iterations,hash:'SHA-256'},material,{name:'AES-GCM',length:256},false,['decrypt']);
  let payload;
  try { payload = await decrypt(envelope,key); } catch { throw new Error('credentials'); }
  const active = {...payload,expires:Date.now()+8*60*60*1000};
  sessionStorage.removeItem('marketing-figueroa-client-victor-lopes');
  sessionStorage.setItem(sessionName,JSON.stringify(active));
  return active;
}
export function bindLogin(onSuccess) {
  document.querySelectorAll('[data-login-form]').forEach(form => {
    form.addEventListener('submit',async event => {
      event.preventDefault();
      const feedback = form.querySelector('[data-login-feedback]');
      const button = form.querySelector('button[type=submit]');
      button.disabled = true;
      feedback.textContent = 'Abrindo sua área…';
      try {
        if (!crypto.subtle) throw new Error('https');
        const active = await login(form.elements.username.value,form.elements.password.value);
        form.elements.password.value = '';
        await onSuccess(active);
      } catch (error) {
        feedback.textContent = error.message === 'credentials' ? 'Usuário ou senha incorretos. Confira e tente novamente.' : error.message === 'https' ? 'Abra o portal por HTTPS ou pela prévia local.' : 'Não foi possível abrir o portal. Verifique a conexão e tente novamente.';
      } finally { button.disabled = false; }
    });
  });
}
document.querySelectorAll('[data-logout]').forEach(button => button.addEventListener('click',logout));
