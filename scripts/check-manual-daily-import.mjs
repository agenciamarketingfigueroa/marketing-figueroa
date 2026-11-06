import {test} from 'node:test';
import assert from 'node:assert/strict';
import {importDailyReport,parseDailyHotmart} from './manual-daily-import.mjs';
const h={A:'Início dos relatórios',B:'Encerramento dos relatórios',C:'Nome do anúncio',U:'Nome do conjunto de anúncios',K:'Valor gasto (BRL)',L:'Impressões',F:'Resultados',G:'Indicador de resultados'};
const row={A:'2026-10-01',B:'2026-10-01',C:'Teste',U:'Conjunto',K:'10.00',L:'100',F:'1',G:'actions:offsite_conversion.fb_pixel_purchase'};
const source={name:'Meta (Outubro).xlsx',rows:1,sha256:'test'};
const meta={start:'2026-10-01',end:'2026-10-01',month:'Outubro',rows:[h,row],source};
const old=()=>({periods:[{start:meta.start,end:meta.end,month:'Outubro',spend:1000,impressions:100,metaPurchases:1,sources:[source,{name:'Hotmart (Outubro).xls',rows:0,sha256:'test'}]}],coverage:{meta:'per-export'},dataset:{mode:'manual',orders:[],insights:[{date:meta.start,periodEnd:meta.end,adId:'original',ad:'Teste',accountId:'manual-meta',spend:1000,impressions:100,purchases:1,clicks:20,purchaseValue:5000}],creatives:[],instagramDaily:[{date:'2026-10-01',views:30,followers:2,interactions:1}]}});
test('troca mídia agregada pela diária preservando detalhes e Instagram, sem modificar a entrada',()=>{
 const previous=old(),copy=structuredClone(previous),next=importDailyReport(previous,[meta],[]);
 assert.deepEqual(previous,copy);assert.equal(next.dataset.insights[0].spend,1000);assert.equal(next.dataset.insights[0].purchaseValue,null);
 assert.deepEqual(next.dataset.manualMetaAggregates,previous.dataset.insights);assert.deepEqual(next.dataset.instagramDaily,previous.dataset.instagramDaily);
 assert.deepEqual(importDailyReport(next,[meta],[]),next);
});
test('rejeita diferenças históricas e períodos sobrepostos antes de escrever',()=>{
 assert.throws(()=>importDailyReport(old(),[{...meta,rows:[h,{...row,K:'10.01'}]}],[]),/divergentes/);
 assert.throws(()=>importDailyReport(old(),[meta,meta],[]),/sobrepostos/);
 assert.throws(()=>importDailyReport(old(),[],[]),/todos os períodos/);
});
const hotHeader={A:'Código da transação',B:'Status da transação',C:'Data da transação',F:'Código do produto',G:'Produto',P:'Moeda de recebimento',Q:'Faturamento bruto (sem impostos)',R:'Faturamento líquido',S:'Venda feita como',AD:'Código SCK',AC:'Código SRC',AB:'Canal usado para venda',BD:'Ferramenta de Venda',BE:'Transação do Produto Principal',AE:'Método de pagamento',AN:'Email do(a) Comprador(a)'};
const hotRow={A:'transaction-test',B:'Aprovado',C:'01/11/2026 12:00:00',F:'p1',G:'Produto',P:'BRL',Q:'29.90',R:'24.235',S:'Produtor',AD:'123456789012',BD:'Produto principal',AE:'Cartão',AN:'private@example.test'};
test('aceita status abreviado de pagamento pendente sem contabilizar como venda',()=>{
 const previous=importDailyReport(old(),[meta],[]);
 const batch={...meta,rows:[hotHeader,{...hotRow,B:'Aguardando Pagto',C:'01/10/2026 12:00:00'}],source:{name:'Hotmart.xls',rows:1,sha256:'test'}};
 const report=importDailyReport(previous,[],[batch]);
 assert.equal(report.dataset.orders[0].status,'WAITING_PAYMENT');
 assert.equal(report.periods[0].sales,0);assert.equal(report.periods[0].gross,0);assert.equal(report.periods[0].net,0);
 assert.deepEqual(report.periods[0].statuses,{'Aguardando pagamento':1});
});
test('importa vendas com arredondamento decimal, anonimiza referências e remove dados pessoais',()=>{
 const rows=parseDailyHotmart([hotHeader,hotRow],{start:'2026-11-01',end:'2026-11-04'});
 assert.equal(rows[0].gross,2990);assert.equal(rows[0].net,2424);assert.equal(rows[0].manualSourceCategory,'Código numérico SCK');
 assert.match(rows[0].transaction,/^ref-[a-f0-9]{16}$/);assert.deepEqual(rows[0].source,{});
 assert.ok(!JSON.stringify(rows).includes(hotRow.AN));assert.ok(!JSON.stringify(rows).includes(hotRow.AD));assert.ok(!JSON.stringify(rows).includes(hotRow.A));
 assert.throws(()=>parseDailyHotmart([hotHeader,hotRow,hotRow],{start:'2026-11-01',end:'2026-11-04'}),/duplicado/);
});
