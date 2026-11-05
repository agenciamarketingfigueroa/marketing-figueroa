import {it,expect} from 'vitest';
import {demoDataset} from '../src/lib/demo';
import {select,type Dataset,type Filters} from '../src/lib/domain';
import {reportMetrics} from '../src/lib/report-metrics';
import {dailyPerformance,instagramPerformance} from '../src/lib/performance';
import {seal,unseal} from '../manual/crypto';

const f:Filters={start:'2026-09-01',end:'2026-09-30',currency:'BRL',account:'all',product:'all'};
function manual():Dataset {
  const base=demoDataset();
  return {...base,mode:'manual',mappings:[],orders:[{...base.orders[0],purchasedAt:'2026-09-12T12:00:00-03:00',approvedAt:null,status:'COMPLETE',currency:'BRL',gross:12000,net:10000}],insights:[{...base.insights[0],date:f.start,periodEnd:f.end,currency:'BRL',spend:5000,impressions:10000,purchases:3,clicks:null,views:null,checkouts:null,purchaseValue:null}],manualPeriods:[{start:f.start,end:f.end,month:'Setembro',sources:[]}],coverage:{meta:[],hotmart:[{start:Date.parse(f.start+'T00:00:00-03:00'),end:Date.parse(f.end+'T23:59:59.999-03:00')}]}};
}
it('preserva totais mensais e distingue ausência de dado de zero',()=>{
  const result=reportMetrics(manual(),f,'2026-11-04');
  expect(result.metaCovered).toBe(true);
  expect(result.metrics).toMatchObject({spend:5000,gross:12000,net:10000,sales:1,mer:2.4,profit:5000,purchases:3,metaRoas:null,attributedRoas:null,pending:null,refunds:null,clicks:null});
});
it('tracking manual divide compras Meta por vendas Hotmart, sem limitar a 100%',()=>{
  const data=manual();expect(reportMetrics(data,f).metrics.trackingRate).toBe(300);
  data.orders=[];expect(reportMetrics(data,f).metrics.trackingRate).toBeNull();
  expect(reportMetrics(manual(),{...f,end:'2026-09-12'}).metrics.trackingRate).toBeNull();
});
it('soma novos seguidores no período e mantém lacunas indisponíveis',()=>{
  const data=manual();data.instagramFollowersKind='new';
  data.instagramDaily=[{date:'2026-09-01',followers:12,views:100,interactions:7},{date:'2026-09-02',followers:8,views:200,interactions:5}];
  expect(instagramPerformance(data,'2026-09-01','2026-09-02')).toMatchObject({complete:true,followers:20,views:300,interactions:12});
  expect(instagramPerformance(data,'2026-09-02','2026-09-02')).toMatchObject({followers:8,views:200});
  expect(instagramPerformance(data,'2026-09-01','2026-09-03')).toMatchObject({complete:false,followers:null,views:null,interactions:null});
});
it('não atribui o gasto mensal ao primeiro dia nem rateia dias',()=>{
  const data=manual();const partial={...f,end:'2026-09-12'};
  expect(select(data,partial).insights).toEqual([]);
  expect(reportMetrics(data,partial).metrics).toMatchObject({spend:null,gross:12000,mer:null});
  const daily=dailyPerformance(data,f,'2026-11-04');
  expect(daily.every(p=>p.spend===null)).toBe(true);
  expect(daily.at(-1)?.cumulativeRevenue).toBe(120);
  expect(daily[0].sales).toBe(0);
});
it('não transforma ausência de mídia em USD ou produto sem mapeamento em gasto zero',()=>{
  const data=manual();
  expect(reportMetrics(data,{...f,currency:'USD'}).metrics.spend).toBeNull();
  expect(reportMetrics(data,{...f,product:data.orders[0].productId}).metrics.spend).toBeNull();
  expect(reportMetrics(data,{...f,account:data.insights[0].accountId}).metrics.gross).toBeNull();
});
it('mantém lacunas entre exports indisponíveis',()=>{
  const data=manual();
  data.manualPeriods!.push({start:'2026-10-02',end:'2026-10-31',month:'Outubro',sources:[]});
  expect(reportMetrics(data,{...f,end:'2026-10-31'}).metaCovered).toBe(false);
});
it('apresenta status do export atualizado sem misturar moedas ou preencher lacunas',()=>{
  const data=manual();data.manualStatusComplete=true;
  data.orders.push({...data.orders[0],transaction:'refund',status:'REFUNDED'},{...data.orders[0],transaction:'dollar',status:'REFUNDED',currency:'USD'});
  expect(reportMetrics(data,f).metrics).toMatchObject({sales:1,refunds:1,pending:0,gross:12000});
  expect(reportMetrics(data,{...f,start:'2026-08-31'}).metrics.refunds).toBeNull();
});
it('criptografa e restaura complementos e rejeita outra chave',async()=>{
  const value={followers:[{username:'teste',date:'2026-10-31',followers:100}]};
  const encrypted=await seal(value,'chave-exclusiva-do-teste');
  expect(JSON.stringify(encrypted)).not.toContain('followers');
  expect(await unseal(encrypted,'chave-exclusiva-do-teste')).toEqual(value);
  await expect(unseal(encrypted,'outra-chave')).rejects.toThrow();
});
