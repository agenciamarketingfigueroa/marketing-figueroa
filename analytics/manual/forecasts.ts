import {z} from 'zod';
import {type Forecast,type ForecastActions,forecastKey,monthRange} from '../src/lib/board-analysis';
import {daysBetween} from '../src/lib/domain';
import {seal,unseal} from './crypto';

const day=z.string().regex(/^\d{4}-\d{2}-\d{2}$/).refine(value=>{
  const parsed=new Date(value+'T12:00:00Z');return Number.isFinite(parsed.getTime())&&parsed.toISOString().slice(0,10)===value;
});
const amount=z.number().int().nonnegative().max(Number.MAX_SAFE_INTEGER).nullable();
const values={gross:amount,net:amount,sales:amount,spend:amount,purchases:amount};
const schema=z.object({type:z.literal('figueroa-board-forecasts-v1'),forecasts:z.array(z.object({
  version:z.literal(1),organizationId:z.string().min(1).max(200),currency:z.string().regex(/^[A-Z]{3}$/),
  target:z.string().regex(/^\d{4}-(0[1-9]|1[0-2])$/),createdOn:day,method:z.literal('daily-rate-v1'),
  months:z.array(z.object({start:day,end:day,days:z.number().int().min(28).max(31),...values})).min(1).max(3),
  base:z.object(values),
})).max(240)});
export function forecastsFrom(value:unknown):Forecast[] {
  const {forecasts}=schema.parse(value),keys=new Set<string>();
  for(const f of forecasts) {
    const key=forecastKey(f);
    if(keys.has(key)||f.createdOn.slice(0,7)>f.target)throw Error('INVALID_FORECAST');
    // Intl also validates the currency before it is used by the renderer.
    new Intl.NumberFormat('pt-BR',{style:'currency',currency:f.currency});
    keys.add(key);
    let previous='';
    for(const m of f.months) {
      const range=monthRange(m.start.slice(0,7));
      if(m.start!==range.start||m.end!==range.end||m.days!==daysBetween(m.start,m.end)||m.end>=f.createdOn||m.end>=f.target+'-01'||m.start<=previous)throw Error('INVALID_BASELINE');
      previous=m.end;
    }
  }
  return forecasts;
}

export function createForecastActions(passphrase:string,organizationId:string,assertSession:()=>void):ForecastActions {
  const storageKey='figueroa-board-forecasts-v1:'+organizationId;
  const pack=(forecasts:Forecast[])=>({type:'figueroa-board-forecasts-v1',forecasts});
  const validate=(value:unknown)=>{
    const forecasts=forecastsFrom(value);
    if(forecasts.some(f=>f.organizationId!==organizationId))throw Error('ORGANIZATION');
    return forecasts;
  };
  const load=async()=>{assertSession();const saved=localStorage.getItem(storageKey);return saved?validate(await unseal(JSON.parse(saved),passphrase)):[];};
  const write=async(forecasts:Forecast[])=>{
    validate(pack(forecasts));assertSession();const envelope=await seal(pack(forecasts),passphrase);assertSession();
    localStorage.setItem(storageKey,JSON.stringify(envelope));return forecasts;
  };
  return {
    load,
    save:async forecast=>{
      const existing=await load();
      // Never replace the original estimate when new imports arrive.
      if(existing.some(f=>forecastKey(f)===forecastKey(forecast)))return existing;
      return write([...existing,forecast]);
    },
    download:async()=>{
      const forecasts=await load();const envelope=await seal(pack(forecasts),passphrase);assertSession();
      const url=URL.createObjectURL(new Blob([JSON.stringify(envelope)],{type:'application/json'}));
      const a=document.createElement('a');a.href=url;a.download='painel-projecoes.enc.json';a.click();setTimeout(()=>URL.revokeObjectURL(url),1000);
    },
    restore:async file=>{
      assertSession();if(file.size>2_000_000)throw Error('FILE_SIZE');
      const imported=validate(await unseal(JSON.parse(await file.text()),passphrase));
      const existing=await load(),keys=new Set(existing.map(forecastKey));
      return write([...existing,...imported.filter(f=>!keys.has(forecastKey(f)))]);
    },
  };
}
