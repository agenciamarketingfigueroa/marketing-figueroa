import test from 'node:test';
import assert from 'node:assert/strict';
import {parseInstagram,classifyLinkedAdditions} from '../scripts/core.mjs';
test('Instagram UTF16 diário mantém zero real e significado de novos seguidores',()=>{
  const raw=Buffer.from('\uFEFFsep=,\n"Seguidores no Instagram"\n"Data","Primary"\n"2026-11-07T00:00:00","0"\n','utf16le');
  assert.deepEqual(parseInstagram(raw,'hash'),[{date:'2026-11-07',field:'followers',value:0,source:'hash',line:4}]);
});
test('Instagram rejeita ausência, valor inválido e duplicação dentro do arquivo',()=>{
  const head='sep=,\n"Visualizações"\n"Data","Primary"\n';
  assert.throws(()=>parseInstagram(head+'"2026-11-07T00:00:00",""','h'));
  assert.throws(()=>parseInstagram(head+'"2026-11-07T00:00:00","1"\n"2026-11-07T00:00:00","1"','h'));
});
test('adicionais exigem vínculo comprovado; pack confirmado vendido como bump não vira principal',()=>{
  const products={main:{name:'Pack',category:'principal'},extra:{name:'Extra',category:'adicional'}};
  const orders=[{transaction:'t',item:'main',product:'Pack',category:'principal',operation:'mvave-br',country:'Brasil',currency:'BRL'},...['t','unknown'].map((parent,i)=>({transaction:'e'+i,item:'extra',product:'Extra',category:'bump',operation:'mvave-br',country:'Brasil',currency:'BRL',parent})),{transaction:'pack-bump',item:'main',product:'Pack',category:'bump',country:'Brasil',currency:'BRL',parent:'other'}];
  const r=classifyLinkedAdditions({orders},products).orders;assert.equal(r[1].operation,'mvave-br');assert.equal(r[2].operation,'REVISAR');assert.equal(r[3].operation,'mvave-br');assert.equal(r[3].category,'bump');
});
