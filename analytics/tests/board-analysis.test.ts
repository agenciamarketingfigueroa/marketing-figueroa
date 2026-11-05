import {afterEach,describe,expect,it,vi} from 'vitest';
import {demoDataset} from '../src/lib/demo';
import type {Dataset,Filters} from '../src/lib/domain';
import {buildForecast,forecastActual,forecastScenario,monthRange,nextMonth,productPerformance} from '../src/lib/board-analysis';
import {createForecastActions,forecastsFrom} from '../manual/forecasts';

afterEach(()=>vi.unstubAllGlobals());
const windowFor=(start:string,end:string)=>({start:Date.parse(start+'T00:00:00-03:00'),end:Date.parse(end+'T23:59:59.999-03:00')});
function fixture():Dataset {
  const demo=demoDataset();
  return {...demo,organizationId:'board-test',mode:'manual',mappings:[],manualMetaIdPrecision:'exact',
    manualPeriods:[{start:'2026-09-01',end:'2026-09-30',month:'Setembro',sources:[]},{start:'2026-10-01',end:'2026-10-31',month:'Outubro',sources:[]}],
    coverage:{meta:[],hotmart:[windowFor('2026-08-21','2026-10-31')]},
    insights:[{...demo.insights[0],date:'2026-09-01',periodEnd:'2026-09-30',spend:30000,purchases:3},
      {...demo.insights[0],date:'2026-10-01',periodEnd:'2026-10-31',spend:62000,purchases:6}],
    orders:[{...demo.orders[0],accountId:'hotmart',productId:'p1',product:'Produto A',status:'APPROVED',currency:'BRL',purchasedAt:'2026-09-15T12:00:00-03:00',approvedAt:null,gross:60000,net:50000},
      {...demo.orders[0],accountId:'hotmart',productId:'p2',product:'Produto B',status:'COMPLETE',currency:'BRL',purchasedAt:'2026-10-15T12:00:00-03:00',approvedAt:null,gross:124000,net:100000}],
  };
}
const filters:Filters={start:'2026-09-01',end:'2026-10-31',currency:'BRL',account:'all',product:'all'};
describe('Produtos no painel',()=>{
  it('ranqueia por quantidade, separa moeda/status e não usa o gasto geral como CPA de produto',()=>{
    const data=fixture();
    data.orders.push({...data.orders[0],gross:1000},{...data.orders[1],status:'REFUNDED',gross:9999999},{...data.orders[1],currency:'USD',gross:9999999});
    const rows=productPerformance(data,filters,'2026-11-05');
    expect(rows.map(r=>[r.name,r.sales,r.gross])).toEqual([['Produto A',2,61000],['Produto B',1,124000]]);
    expect(rows.every(r=>r.cpa===null)).toBe(true);
    data.orders[0].net=null;
    expect(productPerformance(data,filters,'2026-11-05')[0].net).toBeNull();
  });
  it('usa apenas anúncios com vínculo exclusivo e IDs precisos; bloqueia períodos parciais',()=>{
    const data=fixture(),ad=data.insights[0];
    const mapping={sourceKey:'sck',sourceValue:'test',hotmartAccountId:'hotmart',productId:'p1',offer:null,accountId:ad.accountId,campaignId:ad.campaignId,adsetId:ad.adsetId,adId:ad.adId};
    data.mappings=[mapping];
    expect(productPerformance(data,filters,'2026-11-05').find(r=>r.name==='Produto A')?.cpa).toBeCloseTo(92000/9);
    expect(productPerformance(data,{...filters,start:'2026-09-02'},'2026-11-05').every(r=>r.cpa===null)).toBe(true);
    data.mappings.push({...mapping,productId:'p2'});
    expect(productPerformance(data,filters,'2026-11-05').every(r=>r.cpa===null)).toBe(true);
    data.mappings=[mapping];data.manualMetaIdPrecision='rounded';
    expect(productPerformance(data,filters,'2026-11-05').every(r=>r.cpa===null)).toBe(true);
  });
});
describe('Projeção e realizado',()=>{
  it('projeta dezembro pelo ritmo ponderado dos meses fechados; exclui agosto parcial e novembro atual',()=>{
    const data=fixture();
    data.orders.push({...data.orders[0],gross:9999999,purchasedAt:'2026-08-21T12:00:00-03:00'});
    const f=buildForecast(data,'BRL','2026-12','2026-11-05')!;
    expect(f.months.map(m=>m.start)).toEqual(['2026-09-01','2026-10-01']);
    expect(f.base).toEqual({gross:Math.round(184000/61*31),net:Math.round(150000/61*31),sales:1,spend:Math.round(92000/61*31),purchases:5});
    expect(forecastScenario(f,.8).spend).toBe(f.base.spend);
    expect(forecastScenario(f,1.2).gross).toBe(Math.round(f.base.gross!*1.2));
    expect(buildForecast(data,'BRL','2026-11','2026-11-05')).toBeNull();
    expect(nextMonth('2026-12-31')).toBe('2027-01');
    expect(monthRange('2028-02').end).toBe('2028-02-29');
  });
  it('não usa meses com lacunas e mantém mídia ausente nula sem contaminar receita',()=>{
    const data=fixture();data.manualPeriods=[];
    expect(buildForecast(data,'BRL','2026-12','2026-11-05')!.base.spend).toBeNull();
    data.coverage!.hotmart=[windowFor('2026-09-01','2026-09-14'),windowFor('2026-09-16','2026-09-30')];
    expect(buildForecast(data,'BRL','2026-12','2026-11-05')).toBeNull();
    data.coverage!.hotmart=[windowFor('2026-10-01','2026-10-31')];data.orders=[];
    expect(buildForecast(data,'USD','2026-12','2026-11-05')!.base).toMatchObject({gross:0,sales:0,spend:null,purchases:null});
  });
  it('compara prefixos fechados por provedor sem contar dias futuros ou recalcular a base',()=>{
    const data=fixture(),f=buildForecast(data,'BRL','2026-12','2026-11-05')!;
    const base=structuredClone(f.base);
    expect(forecastActual(data,f,'2026-11-05')).toEqual({hotmart:null,meta:null});
    data.coverage!.hotmart.push(windowFor('2026-12-01','2026-12-10'));
    data.orders.push({...data.orders[0],gross:77700,purchasedAt:'2026-12-02T12:00:00-03:00'});
    const actual=forecastActual(data,f,'2026-12-05');
    expect(actual.hotmart).toMatchObject({through:'2026-12-04',gross:77700,sales:1});
    expect(actual.meta).toBeNull();
    data.manualPeriods!.push({start:'2026-12-01',end:'2026-12-31',month:'Dezembro',sources:[]});
    data.insights.push({...data.insights[0],date:'2026-12-01',periodEnd:'2026-12-31',spend:70000});
    expect(forecastActual(data,f,'2026-12-15').meta).toBeNull();
    expect(forecastActual(data,f,'2027-01-01').meta).toMatchObject({through:'2026-12-31',spend:70000});
    expect(f.base).toEqual(base);
  });
});
describe('Histórico de projeções',()=>{
  it('fixa, recarrega e restaura estimativas criptografadas sem sobrescrever a original',async()=>{
    const storage=new Map<string,string>();
    vi.stubGlobal('localStorage',{getItem:(key:string)=>storage.get(key)??null,setItem:(key:string,value:string)=>storage.set(key,value)});
    const actions=createForecastActions('test-only-passphrase','board-test',()=>{});
    const f=buildForecast(fixture(),'BRL','2026-12','2026-11-05')!;
    await actions.save(f);
    expect([...storage.values()][0]).not.toContain('daily-rate-v1');
    const changed={...f,base:{...f.base,gross:9999999}};
    await actions.save(changed);
    expect((await createForecastActions('test-only-passphrase','board-test',()=>{}).load())[0]).toEqual(f);
    const file=new File([[...storage.values()][0]],'copy.json');
    expect(await actions.restore(file)).toEqual([f]);
    await expect(createForecastActions('wrong-passphrase','board-test',()=>{}).load()).rejects.toThrow();
    const original=[...storage.values()][0];
    await expect(actions.restore(new File(['{}'],'invalid.json'))).rejects.toThrow();
    expect([...storage.values()][0]).toBe(original);
  });
  it('rejeita datas impossíveis, histórico duplicado e bases posteriores à criação',()=>{
    const f=buildForecast(fixture(),'BRL','2026-12','2026-11-05')!;
    const pack=(forecasts:unknown[])=>({type:'figueroa-board-forecasts-v1',forecasts});
    expect(forecastsFrom(pack([f]))).toEqual([f]);
    expect(()=>forecastsFrom(pack([f,f]))).toThrow();
    expect(()=>forecastsFrom(pack([{...f,createdOn:'2026-02-30'}]))).toThrow();
    expect(()=>forecastsFrom(pack([{...f,createdOn:'2026-10-10'}]))).toThrow();
  });
});
