import {describe,it,expect} from 'vitest';
import {coversPeriod} from '../src/lib/coverage';
import {reportMetrics} from '../src/lib/report-metrics';
import {demoDataset} from '../src/lib/demo';
import {select,summarize,type Filters} from '../src/lib/domain';
const window=(start:string,end=start)=>({start:Date.parse(start+'T00:00:00-03:00'),end:Date.parse(end+'T23:59:59.999-03:00')});
describe('Cobertura de importações consecutivas',()=>{
  it('reconhece histórico + dois dias novos fora de ordem sem mudar a entrada',()=>{
    const windows=[window('2026-08-21','2026-11-05'),window('2026-11-07'),window('2026-11-06')];const original=structuredClone(windows);
    expect(coversPeriod(windows,'2026-08-21','2026-11-07','2026-11-08')).toBe(true);expect(windows).toEqual(original);
  });
  it('mantém indisponível um recorte com dia realmente ausente',()=>{
    expect(coversPeriod([window('2026-08-21','2026-11-05'),window('2026-11-07')],'2026-08-21','2026-11-07','2026-11-08')).toBe(false);
  });
  it('não exige fechamento futuro para o dia atual parcial',()=>{
    const windows=[window('2026-11-06'),{start:Date.parse('2026-11-07T00:00:00-03:00'),end:Date.parse('2026-11-07T13:00:00-03:00')}];
    expect(coversPeriod(windows,'2026-11-06','2026-11-07','2026-11-07')).toBe(true);
    expect(coversPeriod(windows,'2026-11-06','2026-11-07','2026-11-08')).toBe(false);
  });
  it('exibe receita, resultado e MER acumulados usados pelo Analytics e Painel',()=>{
    const data=demoDataset();data.mode='manual';const windows=[window('2026-08-22'),window('2026-08-21')];
    data.coverage={meta:windows,hotmart:windows};data.manualMetaDailyCoverage=windows;
    const f:Filters={start:'2026-08-21',end:'2026-08-22',currency:'BRL',account:'all',product:'all'};
    const selected=select(data,f),expected=summarize(selected.orders,selected.insights,data.mappings),actual=reportMetrics(data,f,'2026-11-08');
    expect(actual.hotmartCovered).toBe(true);expect(actual.metaCovered).toBe(true);
    expect(actual.metrics.gross).toBeGreaterThan(0);
    for(const k of ['gross','net','profit','mer','sales'] as const)expect(actual.metrics[k]).toBe(expected[k]);
    data.coverage.hotmart=[window('2026-08-22')];expect(reportMetrics(data,f,'2026-11-08').metrics.gross).toBeNull();
  });
});
