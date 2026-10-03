import assert from 'node:assert/strict';
import {test} from 'node:test';
import {aggregate,metrics,divide} from '../assets/scripts/traffic-metrics.js';

const week=(overrides={})=>({start:'2026-08-21',end:'2026-08-23',days:3,spend:10000,gross:30000,net:24000,sales:10,brlSales:8,usdGross:900,usdNet:700,usdSales:2,clicks:200,views:100,checkouts:20,purchases:5,metaRevenue:20000,ads:[],products:[],daily:[],...overrides});
test('profit uses net receipts; USD never enters BRL metrics',()=>{
  const value=metrics(week());
  assert.equal(value.profit,14000);
  assert.equal(value.roas,3);
  assert.equal(value.metaRoas,2);
  assert.equal(value.ticket,3750);
  assert.equal(value.cpa,2000);
});
test('period ratios use sums rather than an average of weekly ratios',()=>{
  const value=aggregate([week(),week({spend:30000,gross:30000,net:24000})]);
  assert.equal(value.roas,1.5);
  assert.equal(value.profit,8000);
  assert.equal(value.usdGross,1800);
  assert.equal(value.sales,20);
});
test('zero denominator is unavailable, zero purchases is a valid zero conversion',()=>{
  assert.equal(divide(8,0),null);
  assert.equal(metrics(week({purchases:0})).cpa,null);
  assert.equal(metrics(week({purchases:0})).conversion,0);
});
test('losses remain negative and products group consistently across periods',()=>{
  const a=week({spend:40000,products:[{name:'Pack',gross:30000,sales:8}],ads:[{name:'Creative',spend:40000,purchases:5}]});
  const result=aggregate([a,a]);
  assert.equal(result.profit,-32000);
  assert.equal(result.products.length,1);
  assert.equal(result.products[0].gross,60000);
  assert.equal(result.ads[0].purchases,10);
});
