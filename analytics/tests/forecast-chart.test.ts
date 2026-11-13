import {describe,it,expect} from 'vitest';
import {demoDataset} from '../src/lib/demo';
import type {Forecast} from '../src/lib/board-analysis';
import {forecastChart,forecastIndicators,type ForecastIndicator} from '../src/lib/forecast-chart';

const forecast:Forecast={version:1,organizationId:'test',currency:'BRL',target:'2026-11',createdOn:'2026-11-01',method:'daily-rate-v1',months:[],base:{gross:30000,net:24000,sales:60,spend:6000,purchases:30}};
function fixture(){
  const data=demoDataset();data.mode='manual';data.orders=[];
  const insight=data.insights[0];
  data.insights=[{...insight,date:'2026-11-01',spend:100,purchases:1},{...insight,date:'2026-11-02',spend:300,purchases:9}];
  data.manualPeriods=[{start:'2026-11-01',end:'2026-11-02',month:'Novembro',sources:[]}];
  data.coverage={hotmart:[{start:Date.parse('2026-11-01T00:00:00-03:00'),end:Date.parse('2026-11-02T23:59:59.999-03:00')}],meta:[]};
  data.manualMetaDailyCoverage=data.coverage.hotmart;
  return data;
}
describe('indicador do gráfico de projeção',()=>{
  it('alterna valores e unidades sem modificar a projeção fixada',()=>{
    const before=structuredClone(forecast),data=fixture();
    const expected={gross:300,net:240,sales:60,spend:60,purchases:30,cpa:2,mer:5};
    for(const indicator of Object.keys(forecastIndicators) as ForecastIndicator[]){
      const rows=forecastChart(data,forecast,'2026-11-02',indicator);
      expect(rows.at(-1)!.base).toBe(expected[indicator]);expect(rows.at(-1)!.actual).toBeNull();
    }
    expect(forecast).toEqual(before);
  });
  it('calcula CPA pelo gasto e compras acumulados, sem somar ou tirar média de CPAs diários',()=>{
    const rows=forecastChart(fixture(),forecast,'2026-11-02','cpa');
    expect(rows[0].actual).toBe(1);expect(rows[1].actual).toBe(.4);
    expect(rows[0].base).toBe(2);expect(rows[29].base).toBe(2);
    expect(rows[0].low).toBe(2.5);expect(rows[0].high).toBeCloseTo(6000/36/100);
  });
  it('preserva lacunas e divisão por zero; cenários de investimento permanecem iguais',()=>{
    const data=fixture();data.insights[0].purchases=0;
    expect(forecastChart(data,forecast,'2026-11-04','cpa')[0].actual).toBeNull();
    const rows=forecastChart(data,forecast,'2026-11-04','spend');
    expect(rows[1].actual).toBe(4);expect(rows[2].actual).toBeNull();expect(rows[3].actual).toBeNull();
    expect(rows[29]).toMatchObject({low:60,base:60,high:60});
    const missing={...forecast,base:{...forecast.base,spend:null}};
    expect(forecastChart(data,missing,'2026-11-02','cpa')[0].base).toBeNull();
    expect(forecastChart(data,missing,'2026-11-02','mer')[0].base).toBeNull();
  });
});
