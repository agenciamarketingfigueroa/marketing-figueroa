import assert from 'node:assert/strict';
import {test} from 'node:test';
import {combineReports} from '../assets/scripts/operation-report.js';
import {aggregate} from '../assets/scripts/traffic-metrics.js';

const week=(start='2026-10-05',end='2026-10-11',overrides={})=>({
  id:start,start,end,days:7,spend:10000,gross:30000,net:24000,sales:10,brlSales:8,
  usdGross:900,usdNet:700,usdSales:2,clicks:200,views:100,checkouts:20,purchases:5,metaRevenue:20000,
  ads:[{name:'Criativo',spend:10000,clicks:200,views:100,checkouts:20,purchases:5,metaRevenue:20000}],
  products:[{name:'Curso',gross:30000,net:24000,sales:10,brlSales:8,usdGross:900,usdNet:700,usdSales:2}],
  daily:[{date:start,gross:30000,net:24000,sales:10,brlSales:8,usdGross:900,usdNet:700,usdSales:2}],
  sources:[{name:'Meta.xlsx',sha256:'one',rows:1},{name:'Hotmart.xls',sha256:'two',rows:10}],
  ...overrides
});
const report=(id,weeks)=>({schemaVersion:1,client:{id},weeks});

test('soma valores BRL e mantém USD separado na mesma semana',()=>{
  const result=combineReports(report('mvave-br',[week()]),report('oficina-do-violao',[week(undefined,undefined,{spend:5000,gross:12000,net:9000,usdGross:300,usdNet:250,usdSales:1,daily:[{date:'2026-10-05',gross:12000,net:9000,sales:10,brlSales:8,usdGross:300,usdNet:250,usdSales:1}]})]));
  const current=result.weeks[0];
  assert.equal(current.days,7);
  assert.equal(current.spend,15000);
  assert.equal(current.gross,42000);
  assert.equal(current.usdGross,1200);
  assert.equal(aggregate(result.weeks).profit,18000);
  assert.equal(current.products.length,2);
  assert(current.products.some(item=>item.name==='Mvave BR · Curso'));
  assert(current.products.some(item=>item.name==='Oficina do Violão · Curso'));
  assert.equal(current.daily.length,1);
  assert.equal(current.daily[0].gross,42000);
  assert.deepEqual(result.pending,[]);
});

test('sem arquivo da Oficina o consolidado sinaliza cobertura parcial',()=>{
  const result=combineReports(report('mvave-br',[week()]));
  assert.deepEqual(result.pending,['Oficina do Violão']);
  assert.equal(result.weeks[0].gross,30000);
  assert.equal(result.coverage.length,1);
});

test('campo ausente no Meta continua indisponível no consolidado',()=>{
  const result=combineReports(report('mvave-br',[week()]),report('oficina-do-violao',[week(undefined,undefined,{clicks:null,metaRevenue:null})]));
  assert.equal(result.weeks[0].clicks,null);
  assert.equal(result.weeks[0].metaRevenue,null);
  assert.equal(result.weeks[0].purchases,10);
});

test('recusa períodos sobrepostos que impedem comparação semanal correta',()=>{
  assert.throws(()=>combineReports(report('mvave-br',[week()]),report('oficina-do-violao',[week('2026-10-06','2026-10-12')])),/sobrepostos/);
});
