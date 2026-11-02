import { describe,it,expect } from 'vitest';
import { demoDataset } from '../src/lib/demo';
import { summarize,type Filters,type FollowerSnapshot } from '../src/lib/domain';
import { reportMetrics } from '../src/lib/report-metrics';
import { dailyPerformance,followerSummary,rankedCreatives } from '../src/lib/performance';
import { nextMetaWindow } from '../src/lib/meta-window';
import { safeCreativeUrl } from '../src/lib/media';
import { parseInstagramSnapshot } from '../src/lib/server/instagram';
import { hotmartProductScope } from '../src/lib/server/product-scope';

const filters:Filters={start:'2026-08-21',end:'2026-08-22',account:'all',product:'all',currency:'BRL'};
describe('Funil, crescimento e criativos',()=>{
  it('calcula taxas pelo total, não pela média das taxas diárias',()=>{
    const row=demoDataset().insights[0];
    const m=summarize([],[{...row,spend:10000,clicks:100,views:80,checkouts:20,purchases:4},{...row,spend:5000,clicks:50,views:20,checkouts:5,purchases:1}],[]);
    expect(m).toMatchObject({costPerView:150,costPerCheckout:600,pvToCheckout:25,pvToPurchase:5,cpa:3000});
    expect(m.connectRate).toBeCloseTo(100/150*100);
  });
  it('mantém nulos quando denominador é zero ou etapa não foi recebida',()=>{
    const row=demoDataset().insights[0];
    expect(summarize([],[{...row,views:0,checkouts:0,clicks:0}],[])).toMatchObject({costPerView:null,costPerCheckout:null,connectRate:null,pvToCheckout:null,pvToPurchase:null});
    expect(summarize([],[{...row,views:null}],[])).toMatchObject({costPerView:null,connectRate:null,pvToCheckout:null});
  });
  it('bloqueia métricas do funil e tracking sem cobertura integral',()=>{
    const data=demoDataset();data.mode='live';
    expect(reportMetrics(data,filters).metrics).toMatchObject({costPerView:null,costPerCheckout:null,connectRate:null,pvToCheckout:null,pvToPurchase:null,trackingRate:null,metaRoas:null});
  });
  it('acumula apenas dias conhecidos e não conecta lacunas financeiras',()=>{
    const data=demoDataset();const series=dailyPerformance(data,filters);
    expect(series[0].day).toBe('2026-08-21');
    expect(series[1].cumulativeRevenue).toBeCloseTo(series[0].revenue!+series[1].revenue!);
    data.mode='live';data.coverage={meta:[],hotmart:[{start:Date.parse('2026-08-22T00:00:00-03:00'),end:Date.parse('2026-08-22T23:59:59.999-03:00')}]};
    const partial=dailyPerformance(data,filters,'2026-11-02');
    expect(partial[1].revenue).toBeGreaterThan(0);expect(partial[1].cumulativeRevenue).toBeNull();
  });
  it('classifica criativos e aplica moeda, gasto mínimo e produto',()=>{
    const data=demoDataset();
    const rows=rankedCreatives(data,filters,'roas',0);
    expect(rows).toHaveLength(3);expect(rows[0].metrics.metaRoas).toBeGreaterThanOrEqual(rows[1].metrics.metaRoas!);
    expect(rankedCreatives(data,filters,'roas',1e9)).toHaveLength(0);
    expect(rankedCreatives(data,{...filters,currency:'USD'},'spend',0)).toHaveLength(0);
    expect(rankedCreatives(data,{...filters,product:'p2'},'purchases',0).map(r=>r.ad.adId)).toEqual(['a2']);
  });
  it('demo cobre todo o período solicitado e sinaliza origem fictícia',()=>{
    const data=demoDataset();expect(data.mode).toBe('demo');expect(data.insights[0].date).toBe('2026-08-21');
    expect(data.insights.at(-1)?.date).toBe('2026-11-01');expect(data.followers).toHaveLength(73);
  });
});
describe('Instagram e histórico da Meta',()=>{
  const snapshot=(date:string,followers:number):FollowerSnapshot=>({date,followers,accountId:'ig',username:'teste',observedAt:date+'T15:00:00Z'});
  it('usa a última base anterior ao período e não mistura contas',()=>{
    const summary=followerSummary([snapshot('2026-08-20',100),snapshot('2026-08-21',110),snapshot('2026-08-22',125),{...snapshot('2026-08-22',999),accountId:'other'}],filters.start,filters.end,'ig');
    expect(summary).toMatchObject({delta:25,percent:25,partialBaseline:false});expect(summary.points).toHaveLength(2);
  });
  it('não inventa crescimento para uma coleta única ou período sem registros',()=>{
    const data=[snapshot('2026-08-22',125)];
    expect(followerSummary(data,filters.start,filters.end,'ig')).toMatchObject({delta:null,partialBaseline:true});
    expect(followerSummary(data,'2026-09-01','2026-09-30','ig')).toMatchObject({latest:null,delta:null,points:[]});
  });
  it('valida conta e total de seguidores e aplica data São Paulo',()=>{
    const payload={id:'123',username:'teste',followers_count:250};
    expect(parseInstagramSnapshot(payload,'123','2026-11-02T01:00:00Z')).toMatchObject({followers:250,date:'2026-11-01'});
    expect(()=>parseInstagramSnapshot(payload,'456')).toThrow('INSTAGRAM_ACCOUNT_MISMATCH');
    expect(()=>parseInstagramSnapshot({...payload,followers_count:-1},'123')).toThrow();
  });
  it('alterna janela recente e semanas históricas desde 21/08',()=>{
    const first=nextMetaWindow('2026-11-02',{});expect(first).toMatchObject({start:'2026-10-06',end:'2026-11-02',next:{phase:'history',historyNext:'2026-08-21'}});
    const history=nextMetaWindow('2026-11-02',first.next);expect(history).toMatchObject({start:'2026-08-21',end:'2026-08-27',next:{phase:'recent',historyNext:'2026-08-28'}});
    expect(nextMetaWindow('2026-11-02',{phase:'history',historyNext:'2026-10-04'})).toMatchObject({start:'2026-10-04',end:'2026-10-05'});
    expect(nextMetaWindow('2026-08-22',{})).toMatchObject({start:'2026-08-21',end:'2026-08-22'});
  });
});
describe('Escopo de produtos e imagens',()=>{
  it('aceita somente CDNs Meta em HTTPS, sem credenciais ou token',()=>{
    expect(safeCreativeUrl('https://scontent.xx.fbcdn.net/image.jpg?x=1')).toBeTruthy();
    expect(safeCreativeUrl('https://scontent.cdninstagram.com/image.jpg')).toBeTruthy();
    for(const url of ['http://scontent.xx.fbcdn.net/a','https://fbcdn.net.evil.test/a','https://127.0.0.1/a','https://x.fbcdn.net:8080/a','https://user:pass@x.fbcdn.net/a','https://x.fbcdn.net/a?access_token=secret','javascript:alert(1)']) expect(safeCreativeUrl(url)).toBeNull();
  });
  it('restringe produtos por ID exato e bloqueia configuração vazia',()=>{
    const scope=hotmartProductScope('2422501, 2947368');expect(scope.has('2422501')).toBe(true);expect(scope.has('24225010')).toBe(false);
    expect(()=>hotmartProductScope('')).toThrow();expect(()=>hotmartProductScope('all')).toThrow();
  });
});
