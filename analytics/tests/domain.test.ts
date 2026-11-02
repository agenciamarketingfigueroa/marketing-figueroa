import { describe,it,expect } from 'vitest';
import { minorUnits,money,sumMinor,select,summarize,attribute,previousPeriod,variation,dateInZone,type Filters } from '../src/lib/domain';
import { demoDataset } from '../src/lib/demo';
import { mergeCoverage,coversPeriod } from '../src/lib/coverage';
import { reportMetrics } from '../src/lib/report-metrics';
import { reportCsv } from '../src/lib/export';

const filters:Filters={start:'2026-10-03',end:'2026-11-01',currency:'BRL',account:'all',product:'all'};
describe('Precisão financeira e período',()=>{
  it('não publica MER ou total financeiro com histórico parcial',()=>{
    const data=demoDataset();data.mode='live';data.coverage={meta:[],hotmart:[]};
    const result=reportMetrics(data,filters,'2026-11-02');expect(result.metrics.mer).toBeNull();expect(result.metrics.gross).toBeNull();expect(result.metrics.spend).toBeNull();
    const window={start:Date.parse('2026-09-01T00:00:00-03:00'),end:Date.parse('2026-11-01T23:59:59.999-03:00')};
    data.coverage={meta:[window],hotmart:[window]};expect(reportMetrics(data,filters,'2026-11-02').metrics.mer).toBeGreaterThan(0);
  });
  it('une coberturas contíguas, preservando lacunas e limite de dia completo',()=>{
    expect(mergeCoverage([{start:0,end:10},{start:20,end:30}],{start:11,end:19})).toEqual([{start:0,end:30}]);
    expect(mergeCoverage([{start:0,end:10}],{start:20,end:30})).toHaveLength(2);
    expect(coversPeriod([{start:Date.parse('2026-10-01T00:00:00-03:00'),end:Date.parse('2026-10-01T12:00:00-03:00')}],'2026-10-01','2026-10-01','2026-11-02')).toBe(false);
  });
  it('exporta unidade monetária explícita, filtros e modo demonstrativo',()=>{
    const data=demoDataset();const m=reportMetrics(data,filters).metrics;
    const csv=reportCsv(m,filters,true);expect(csv).toContain('DEMONSTRACAO');expect(csv).toContain('"spend";"BRL";"'+(m.spend!/100).toFixed(2)+'"');
    expect(reportCsv(m,{...filters,product:'=CMD()'},true)).toContain("'=CMD()");
  });
  it('converte decimais sem erro binário e preserva escala da moeda',()=>{
    expect(minorUnits('0.29','BRL')).toBe(29);expect(minorUnits('1234','JPY')).toBe(1234);
    expect(minorUnits('1.001','KWD')).toBe(1001);expect(()=>minorUnits('0.001','BRL')).toThrow();
    expect(()=>minorUnits('9007199254740992','BRL')).toThrow();expect(money(null)).toBe('—');
    expect(()=>sumMinor([Number.MAX_SAFE_INTEGER,1])).toThrow('MONEY_OVERFLOW');
  });
  it('separa moedas e totaliza apenas vendas aprovadas',()=>{
    const data=demoDataset();const {orders,insights}=select(data,filters);const m=summarize(orders,insights,data.mappings);
    expect(orders.every(o=>o.currency==='BRL')).toBe(true);
    expect(m.gross).toBe(orders.filter(o=>o.status==='APPROVED').reduce((s,o)=>s+o.gross,0));
    expect(m.profit).toBe(m.net!-m.spend!);expect(m.mer).toBe(m.gross!/m.spend!);
    const usd=select(data,{...filters,currency:'USD'});expect(usd.orders.length).toBeGreaterThan(0);expect(usd.insights).toHaveLength(0);
    expect(summarize(usd.orders,usd.insights,data.mappings).mer).toBeNull();
  });
  it('não agrega alcance sobreposto nem preenche líquido desconhecido',()=>{
    const data=demoDataset();const {orders,insights}=select(data,filters);orders[0].net=null;
    const m=summarize(orders,insights,data.mappings);expect(m.frequency).toBeNull();expect(m.net).toBeNull();expect(m.profit).toBeNull();
    insights[0].clicks=null;expect(summarize(orders,insights,data.mappings).cpc).toBeNull();
  });
  it('compara janelas iguais e trata base zero',()=>{
    expect(previousPeriod(filters)).toMatchObject({start:'2026-09-03',end:'2026-10-02'});
    expect(variation(100,0)).toBeNull();expect(variation(120,100)).toBe(20);expect(variation(null,100)).toBeNull();
    expect(dateInZone('2026-11-02T02:59:59Z')).toBe('2026-11-01');
  });
  it('não inventa atribuição e recusa correspondências conflitantes',()=>{
    const data=demoDataset();const order=data.orders.find(o=>o.source.sck)!;const match=attribute(order,data.mappings)!;
    expect(match).toBeTruthy();expect(attribute({...order,source:{}},data.mappings)).toBeNull();
    expect(attribute(order,[...data.mappings,{...match,adId:'other'}])).toBeNull();
    expect(attribute({...order,accountId:'outra-conta'},data.mappings)).toBeNull();
  });
  it('filtra limites inclusivos e mantém ausência distinta de zero',()=>{
    const data=demoDataset();const rows=select(data,{...filters,start:'2026-10-03',end:'2026-10-03'});
    expect(rows.insights).toHaveLength(3);expect(summarize([],[],[]).gross).toBeNull();
  });
});
