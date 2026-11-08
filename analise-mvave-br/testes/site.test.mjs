import {test} from 'node:test';
import assert from 'node:assert/strict';
import {bridge} from '../scripts/importar.mjs';
const seed=()=>({dataset:{mode:'manual',organizationId:'mvave-br',orders:[],insights:[],manualPeriods:[],manualMetaAggregates:[],coverage:{meta:[],hotmart:[]}},periods:[]});
const sale=(item='1',extra={})=>({transaction:'tx',item,product:'Pack',category:'principal',operation:'mvave-br',status:'APPROVED',day:'2026-11-06',currency:'BRL',gross:1000,net:800,sck:'',...extra});
const ledger=orders=>({orders,meta:[],ads:[],snapshots:[]});
test('ponte preserva itens de mesma transação e revisões sem duplicar',()=>{const b=ledger([sale(),sale('2')]);const first=bridge(seed(),b);assert.equal(first.dataset.orders.length,2);assert.equal(new Set(first.dataset.orders.map(o=>o.mainOrderId)).size,1);assert.deepEqual(bridge(first,b),first);const next=bridge(first,ledger([sale('1',{status:'CANCELLED'}),sale('2')]));assert.equal(next.dataset.orders.length,2);assert.equal(next.dataset.orders.filter(o=>o.status==='APPROVED').length,1);});
test('reclassificação para REVISAR remove versão aprovada antiga do site',()=>{const first=bridge(seed(),ledger([sale()]));const next=bridge(first,ledger([sale('1',{operation:'REVISAR'})]));assert.equal(next.dataset.orders.length,0);});
