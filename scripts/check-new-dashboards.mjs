// Local browser smoke test with temporary aggregate data and no real credentials.
import {chromium} from 'npm:playwright@1.58.2';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {resolve,extname} from 'node:path';

const root=resolve(import.meta.dirname,'..');
const mime={'.html':'text/html; charset=utf-8','.js':'text/javascript; charset=utf-8','.css':'text/css; charset=utf-8','.svg':'image/svg+xml','.png':'image/png','.webmanifest':'application/manifest+json'};
const server=Deno.serve({hostname:'127.0.0.1',port:0,onListen:()=>{}},async request=>{
  const path=resolve(root,'.'+decodeURIComponent(new URL(request.url).pathname));
  if(!path.startsWith(root))return new Response('Forbidden',{status:403});
  try{return new Response(await readFile(path),{headers:{'content-type':mime[extname(path)]||'application/octet-stream'}});}
  catch{return new Response('Not found',{status:404});}
});
const base=`http://127.0.0.1:${server.addr.port}/`;
const encode=bytes=>btoa(String.fromCharCode(...new Uint8Array(bytes)));
const keyBytes=crypto.getRandomValues(new Uint8Array(32));
const key=await crypto.subtle.importKey('raw',keyBytes,'AES-GCM',false,['encrypt']);
const daily=Array.from({length:7},(_,index)=>({date:`2026-10-${String(index+5).padStart(2,'0')}`,gross:index===0?30000:0,net:index===0?24000:0,sales:index===0?10:0,brlSales:index===0?10:0,usdGross:0,usdNet:0,usdSales:0}));
const week={id:'2026-10-05',start:'2026-10-05',end:'2026-10-11',days:7,spend:10000,gross:30000,net:24000,sales:10,brlSales:10,usdGross:0,usdNet:0,usdSales:0,clicks:200,views:100,checkouts:20,purchases:5,metaRevenue:20000,
  ads:[{name:'Criativo',spend:10000,clicks:200,views:100,checkouts:20,purchases:5,metaRevenue:20000}],
  products:[{name:'Curso',gross:30000,net:24000,sales:10,brlSales:10,usdGross:0,usdNet:0,usdSales:0}],daily,
  sources:[{name:'Meta.xlsx',rows:1},{name:'Hotmart.xls',rows:10}]};
const report={schemaVersion:1,client:{id:'mvave-br',name:'Mvave BR'},weeks:[week]};
const iv=crypto.getRandomValues(new Uint8Array(12));
const sealed={version:1,iv:encode(iv),data:encode(await crypto.subtle.encrypt({name:'AES-GCM',iv},key,new TextEncoder().encode(JSON.stringify(report))))};
const browser=await chromium.launch({executablePath:'C:/Program Files/Google/Chrome/Application/chrome.exe',headless:true});
try{
  const context=await browser.newContext();
  await context.addInitScript(value=>sessionStorage.setItem('figueroa-portal-v1',JSON.stringify(value)),{name:'Teste',role:'master',client:'mvave-br',reportKey:encode(keyBytes),expires:Date.now()+60000});
  await context.route('**/assets/reports/mvave-br/report.enc.json',route=>route.fulfill({json:sealed}));
  const page=await context.newPage();
  const errors=[];page.on('pageerror',error=>errors.push(error.message));
  await page.goto(base+'clientes/mvave-br/index.html');
  await page.locator('#main-metrics .metric').first().waitFor();
  await page.goto(base+'clientes/oficina-do-violao/index.html');
  await page.locator('[data-pending-panel]').waitFor({state:'visible'});
  assert(!(await page.locator('#main-metrics').isVisible()));
  assert(await page.locator('.client-logo').evaluate(image=>image.naturalWidth>0));
  if(Deno.env.get('CHECK_SCREENSHOT')){
    const path=await Deno.makeTempFile({suffix:'.png'});
    await page.screenshot({path,fullPage:true});
    console.log(`Captura da Oficina: ${path}`);
  }
  await page.goto(base+'clientes/operacao/index.html');
  await page.locator('#main-metrics .metric').first().waitFor();
  assert.match(await page.locator('#operation-status').innerText(),/Consolidado parcial/);
  assert.match(await page.locator('#product-chart').innerText(),/Mvave BR · Curso/);
  assert.equal(await page.locator('.operation-logos img').count(),2);
  for(const width of [390,1440]){
    await page.setViewportSize({width,height:900});
    assert(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),`Operação: transbordamento em ${width}px`);
  }
  if(Deno.env.get('CHECK_SCREENSHOT')){
    const path=await Deno.makeTempFile({suffix:'.png'});
    await page.screenshot({path,fullPage:true});
    console.log(`Captura da Operação: ${path}`);
  }
  await page.goto(base+'clientes/index.html');
  await page.locator('[data-master-content]').waitFor({state:'visible'});
  assert.equal(await page.getByRole('link',{name:/Abrir perfil de/}).count(),4);
  for(const width of [390,1440]){
    await page.setViewportSize({width,height:900});
    assert(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),`Lista de clientes: transbordamento em ${width}px`);
  }
  assert.deepEqual(errors,[]);
  const clientContext=await browser.newContext();
  await clientContext.addInitScript(value=>sessionStorage.setItem('figueroa-portal-v1',JSON.stringify(value)),{name:'Teste',role:'client',client:'mvave-br',reportKey:encode(keyBytes),expires:Date.now()+60000});
  const clientPage=await clientContext.newPage();
  await clientPage.goto(base+'clientes/operacao/index.html');
  assert(await clientPage.locator('#access-gate').isVisible());
  assert(!(await clientPage.locator('#dashboard').isVisible()));
  await clientContext.close();
  console.log('Oficina pendente e Operação parcial: renderização, logos, acesso e layout passaram.');
  await context.close();
} finally {await browser.close();await server.shutdown();}
