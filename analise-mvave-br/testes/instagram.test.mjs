import test from 'node:test';
import assert from 'node:assert/strict';
import {parseInstagram,mergeInstagram,classifyLinkedAdditions} from '../scripts/core.mjs';
test('export sem dados não cria data nem zero; métricas parciais preservam histórico e reimportação',()=>{
  assert.deepEqual(parseInstagram(Buffer.from('\uFEFFsep=,\r\n','utf16le'),'empty'),[]);
  assert.throws(()=>parseInstagram('outro formato','invalid'));
  const prior=[{date:'2026-11-07',views:100,followers:4,interactions:5}];
  const rows=[{date:'2026-11-08',field:'views',value:90},{date:'2026-11-08',field:'interactions',value:0}];
  const next=mergeInstagram(prior,rows);
  assert.deepEqual(next,[...prior,{date:'2026-11-08',views:90,followers:null,interactions:0}]);
  assert.deepEqual(prior,[{date:'2026-11-07',views:100,followers:4,interactions:5}]);
  assert.deepEqual(mergeInstagram(next,rows),next);
  assert.deepEqual(mergeInstagram(next,[]),next);
  const completed=mergeInstagram(next,[{date:'2026-11-08',field:'followers',value:0}]);
  assert.equal(completed[1].followers,0);
  assert.throws(()=>mergeInstagram(prior,[...rows,{...rows[0],value:91}]),/conflitantes/);
  assert.throws(()=>mergeInstagram(prior,[{...rows[0],value:null}]),/inválido/);
});
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
