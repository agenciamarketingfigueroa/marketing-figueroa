import {type Dataset,daysBetween,fractionDigits,shiftDay} from './domain';
import {type Forecast,type ForecastValues,forecastRatios,forecastScenario,monthRange} from './board-analysis';
import {reportMetrics} from './report-metrics';

export const forecastIndicators={
  gross:{label:'Receita bruta',title:'Receita bruta acumulada',unit:'money'},
  net:{label:'Receita líquida',title:'Receita líquida acumulada',unit:'money'},
  sales:{label:'Vendas Hotmart',title:'Vendas Hotmart acumuladas',unit:'count'},
  spend:{label:'Investimento',title:'Investimento acumulado',unit:'money'},
  purchases:{label:'Compras Meta',title:'Compras Meta acumuladas',unit:'count'},
  cpa:{label:'CPA Meta',title:'CPA Meta até cada data',unit:'money'},
  mer:{label:'Receita / mídia (MER)',title:'Receita bruta / mídia até cada data',unit:'ratio'},
} as const;
export type ForecastIndicator=keyof typeof forecastIndicators;

export function forecastIndicatorValue(values:ForecastValues,indicator:ForecastIndicator,currency:string) {
  const value=indicator==='cpa'||indicator==='mer'?forecastRatios(values)[indicator]:values[indicator];
  return value===null?null:forecastIndicators[indicator].unit==='money'?value/10**fractionDigits(currency):value;
}

/** Ratios use cumulative numerators/denominators, never summed daily ratios. */
export function forecastChart(data:Dataset,forecast:Forecast,today:string,indicator:ForecastIndicator) {
  const range=monthRange(forecast.target),days=daysBetween(range.start,range.end);
  const scenarioValues=[.8,1,1.2].map(multiplier=>forecastIndicatorValue(forecastScenario(forecast,multiplier),indicator,forecast.currency));
  const isRatio=indicator==='cpa'||indicator==='mer';
  return Array.from({length:days},(_,i)=>{
    const day=shiftDay(range.start,i);
    const projected=scenarioValues.map(value=>value===null?null:isRatio?value:value*(i+1)/days);
    const metrics=day<=today?reportMetrics(data,{...range,end:day,currency:forecast.currency,account:'all',product:'all'},today).metrics:null;
    const actual=metrics?forecastIndicatorValue({gross:metrics.gross,net:metrics.net,sales:metrics.sales,spend:metrics.spend,purchases:metrics.purchases},indicator,forecast.currency):null;
    return {day,label:day.slice(8)+'/'+day.slice(5,7),low:projected[0],base:projected[1],high:projected[2],actual};
  });
}
