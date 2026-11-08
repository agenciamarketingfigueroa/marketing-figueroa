import http from 'node:http';
import {readFile,stat} from 'node:fs/promises';
import {resolve,sep,extname} from 'node:path';

const root=resolve(import.meta.dirname,'..');
const types={'.html':'text/html; charset=utf-8','.js':'text/javascript; charset=utf-8','.css':'text/css; charset=utf-8','.json':'application/json; charset=utf-8','.svg':'image/svg+xml','.png':'image/png','.jpg':'image/jpeg','.jpeg':'image/jpeg','.webp':'image/webp','.woff2':'font/woff2'};
const server=http.createServer(async(request,response)=>{
  try {
    const pathname=decodeURIComponent(new URL(request.url,'http://localhost').pathname);
    const protectedPath=pathname.replaceAll('\\','/').toLowerCase();
    if(protectedPath.startsWith('/analise-mvave-br/dados/')||protectedPath.startsWith('/analise-mvave-br/relatorios/')||protectedPath.split('/').some(segment=>segment.startsWith('.'))) {response.writeHead(403).end();return;}
    const path=resolve(root,'.'+pathname,(pathname.endsWith('/')?'index.html':''));
    if(path!==root&&!path.startsWith(root+sep)) {response.writeHead(403).end();return;}
    if(!(await stat(path)).isFile()) {response.writeHead(404).end();return;}
    response.writeHead(200,{'Content-Type':types[extname(path).toLowerCase()]||'application/octet-stream','Cache-Control':'no-store'});
    response.end(await readFile(path));
  } catch {response.writeHead(404).end();}
});
server.listen(4173,'127.0.0.1',()=>console.log('Prévia: http://127.0.0.1:4173/clientes/analytics/'));
