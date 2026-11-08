import {readFileSync} from 'node:fs';
import {fileURLToPath} from 'node:url';
import {generateReports} from './relatorios.mjs';
const root=fileURLToPath(new URL('..',import.meta.url));
generateReports(JSON.parse(readFileSync(new URL('../dados/normalizados/base.json',import.meta.url),'utf8')),root);
console.log('Relatórios regenerados a partir da base local.');
