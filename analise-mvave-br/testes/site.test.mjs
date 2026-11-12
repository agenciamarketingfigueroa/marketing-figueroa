import {test} from 'node:test';
import assert from 'node:assert/strict';
import {bridge} from '../scripts/importar.mjs';
import {summary} from '../../scripts/manual-daily-import.mjs';
const seed=()=>({dataset:{mode:'manual',organizationId:'mvave-br',orders:[],insights:[],manualPeriods:[],manualMetaAggregates:[],coverage:{meta:[],hotmart:[]}},periods:[]});
const sale=(item='1',extra={})=>({transaction:'tx',item,product:'Pack',category:'principal',operation:'mvave-br',status:'APPROVED',day:'2026-11-06',currency:'BRL',gross:1000,net:800,sck:'',...extra});
const ledger=orders=>({orders,meta:[],ads:[],snapshots:[]});

test('resumo mantém compras Meta ausentes indisponíveis, inclusive em janela mista',()=>{
  const period={start:'2026-11-10',end:'2026-11-11',month:'Novembro'};
  const row=purchases=>({ad:'Teste',spend:100,impressions:10,purchases});
  for(const insights of [[row(null)],[row(2),row(null)],[row(null),row(2)]]){
    const result=summary(period,[],insights,[]);
    assert.equal(result.metaPurchases,null);assert.equal(result.ads[0].purchases,null);
    assert.equal(result.spend,100*insights.length);
  }
  assert.equal(summary(period,[],[row(0)],[]).metaPurchases,0);
  assert.equal(summary(period,[],[row(2),row(3)],[]).metaPurchases,5);
});
test('ponte preserva itens de mesma transação e revisões sem duplicar',()=>{const b=ledger([sale(),sale('2')]);const first=bridge(seed(),b);assert.equal(first.dataset.orders.length,2);assert.equal(new Set(first.dataset.orders.map(o=>o.mainOrderId)).size,1);assert.deepEqual(bridge(first,b),first);const next=bridge(first,ledger([sale('1',{status:'CANCELLED'}),sale('2')]));assert.equal(next.dataset.orders.length,2);assert.equal(next.dataset.orders.filter(o=>o.status==='APPROVED').length,1);});
test('reclassificação para REVISAR remove versão aprovada antiga do site',()=>{const first=bridge(seed(),ledger([sale()]));const next=bridge(first,ledger([sale('1',{operation:'REVISAR'})]));assert.equal(next.dataset.orders.length,0);});
test('preserva pagamento e ferramenta de venda do export na ponte',()=>{const report=bridge(seed(),ledger([sale('1',{payment:'Pix',manualTool:'Produto principal'}),sale('2',{payment:'Cartão de crédito',manualTool:'Produto order bump',category:'bump'})]));assert.equal(report.dataset.orders[0].payment,'Pix');assert.equal(report.dataset.orders[0].manualTool,'Produto principal');assert.equal(report.dataset.orders[1].payment,'Cartão de crédito');assert.equal(report.dataset.orders[1].manualTool,'Produto order bump');assert.equal(report.dataset.orders[1].isBump,true);});
test('importação consolida dias adjacentes e preserva lacunas reais de cobertura',()=>{const before=seed();const w=day=>({start:Date.parse(day+'T00:00:00-03:00'),end:Date.parse(day+'T23:59:59.999-03:00')});before.dataset.coverage.hotmart=[w('2026-11-05')];const b=ledger([sale('1',{day:'2026-11-07'}),sale('2',{day:'2026-11-06'})]);assert.deepEqual(bridge(before,b).dataset.coverage.hotmart,[{start:w('2026-11-05').start,end:w('2026-11-07').end}]);assert.equal(bridge(before,ledger([sale('1',{day:'2026-11-07'})])).dataset.coverage.hotmart.length,2);});
