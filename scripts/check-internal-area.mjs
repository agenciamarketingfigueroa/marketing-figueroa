// Run: deno run -A scripts/check-internal-area.mjs (local HTTP preview on :4173).
// Temporary encrypted fixtures exercise login without using real account passwords.
import { chromium } from 'npm:playwright@1.58.2';
import assert from 'node:assert/strict';
const base = 'http://127.0.0.1:4173/';
const browser = await chromium.launch({executablePath:'/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',headless:true});
const encode = bytes => btoa(String.fromCharCode(...new Uint8Array(bytes)));
async function envelope(username, role) {
  const salt = crypto.getRandomValues(new Uint8Array(16));
  const iv = crypto.getRandomValues(new Uint8Array(12));
  const material = await crypto.subtle.importKey('raw',new TextEncoder().encode(username+'\nfixture-password'),'PBKDF2',false,['deriveKey']);
  const key = await crypto.subtle.deriveKey({name:'PBKDF2',salt,iterations:1000,hash:'SHA-256'},material,{name:'AES-GCM',length:256},false,['encrypt']);
  const payload = {role,name:'Teste',legacyClients:role==='master'?['marketing-figueroa-client-victor-lopes']:[]};
  const data = await crypto.subtle.encrypt({name:'AES-GCM',iv},key,new TextEncoder().encode(JSON.stringify(payload)));
  return {salt:encode(salt),iv:encode(iv),iterations:1000,data:encode(data)};
}
try {
  const context = await browser.newContext();
  const master = await envelope('felipe figueroa','master');
  const client = await envelope('mvave br','client');
  await context.route('**/assets/access/*.json', route => route.fulfill({json:route.request().url().includes('felipe')?master:client}));
  const page = await context.newPage();
  const errors = [];
  page.on('pageerror', error => errors.push(error.message));
  async function submit(username, password='fixture-password') {
    await page.locator('[name=username]').fill(username);
    await page.locator('[name=password]').fill(password);
    await page.locator('[data-login-form] button[type=submit]').click();
  }
  await page.goto(base+'area-interna.html');
  assert(await page.locator('[data-master-gate]').isVisible());
  assert(!(await page.locator('[data-master-content]').isVisible()));
  await submit('Felipe Figueroa','wrong');
  await page.getByText('Usuário ou senha incorretos.',{exact:false}).waitFor();
  await submit('Mvave Br');
  await page.getByText('Use uma conta de administrador',{exact:false}).waitFor();
  assert.equal(await page.evaluate(()=>sessionStorage.getItem('figueroa-portal-v1')),null);
  await submit('Felipe Figueroa');
  await page.locator('[data-master-content]').waitFor({state:'visible'});
  for (const width of [320,390,768,1024,1440]) {
    await page.setViewportSize({width,height:900});
    assert(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),`internal overflow ${width}`);
  }
  await page.getByRole('link',{name:/Tráfego/}).click();
  await page.waitForURL('**/clientes/index.html');
  assert.equal(await page.getByRole('link',{name:/Abrir perfil de/}).count(),2);
  await page.getByRole('link',{name:'Abrir perfil de Victor Lopes'}).click({position:{x:12,y:12}});
  await page.waitForURL('**/clientes/victor-lopes/index.html');
  assert(!(await page.locator('[data-access-gate]').isVisible()));
  await page.goto(base+'clientes/index.html');
  await page.getByRole('link',{name:/Ferramentas da Área Interna/}).click();
  await page.getByRole('button',{name:'Sair ↗'}).click();
  await page.locator('[data-master-gate]').waitFor();
  assert.equal(await page.evaluate(()=>sessionStorage.getItem('marketing-figueroa-client-victor-lopes')),null);
  await page.goto(base+'area-cliente.html');
  await submit('Felipe Figueroa');
  await page.waitForURL('**/area-interna.html');
  // Existing client sessions must not reveal administrator content.
  await page.evaluate(()=>sessionStorage.setItem('figueroa-portal-v1',JSON.stringify({role:'client',expires:Date.now()+60000})));
  await page.reload();
  assert(!(await page.locator('[data-master-content]').isVisible()));
  await page.evaluate(()=>sessionStorage.clear());
  for (const route of ['index.html','sites.html','trafego-pago.html','proposta-trafego.html','area-cliente.html']) {
    await page.goto(base+route);
    assert.equal(await page.locator('.site-nav a').count(),5);
    assert.equal(await page.locator('.site-nav').getByRole('link',{name:'Área Interna',exact:true,includeHidden:true}).getAttribute('href'),'area-interna.html');
    assert.equal(await page.locator('.site-nav').getByRole('link',{name:'Área do Cliente',exact:true,includeHidden:true}).getAttribute('href'),'area-cliente.html');
    for (const width of [320,390,768,900,1024,1440]) {
      await page.setViewportSize({width,height:900});
      assert(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),`${route} overflow ${width}`);
    }
    await page.setViewportSize({width:390,height:844});
    await page.locator('.nav-toggle').click();
    assert(await page.locator('.site-nav').getByRole('link',{name:'Área Interna',exact:true}).isVisible());
  }
  assert.deepEqual(errors,[]);
  console.log('Internal area: login, role checks, tools, client shortcut, logout, public menus and responsive layouts passed.');
} finally { await browser.close(); }
