import {describe,it,expect} from 'vitest';
import type {Dataset,Insight,Filters} from '../src/lib/domain';
import {metaSupplements} from '../src/lib/meta-supplements';
import {createElement} from 'react';
import {renderToStaticMarkup} from 'react-dom/server';
import {MetaSupplements} from '../src/components/meta-supplements';

const filters:Filters={start:'2026-11-01',end:'2026-11-11',currency:'BRL',account:'all',product:'all'};
const row={date:'2026-11-11',accountId:'manual-meta',currency:'BRL',spend:8147,purchases:3,purchaseValue:7335,clicks:142,views:112,checkouts:12} as Insight;
const make=()=>({insights:[{...row,spend:9209,purchases:null}],manualMetaSupplementalExports:[{sha256:'a',name:'Meta',date:row.date,importedAt:'2026-11-12T15:00:00Z',filter:'Somente ativos',rows:[row]}]} as Dataset);
describe('exports filtrados complementares',()=>{
  it('exibe cobertura parcial e distingue ROAS do recorte dos totais gerais',()=>{
    const html=renderToStaticMarkup(createElement(MetaSupplements,{data:make(),filters}));
    expect(html).toContain('cobertura parcial');expect(html).toContain('81,47');expect(html).toContain('92,09');expect(html).toContain('0,90');
    expect(html).toContain('não completam os totais');expect(html).toContain('Ver funil e resultados do recorte');
  });
  it('calcula somente o recorte sem somar mídia nem completar total desconhecido',()=>{
    const data=make(),before=structuredClone(data),[s]=metaSupplements(data,filters);
    expect(s.spend).toBe(8147);expect(s.knownSpend).toBe(9209);expect(s.purchases).toBe(3);
    expect(s.roas).toBeCloseTo(7335/8147);expect(s.cpa).toBeCloseTo(8147/3);
    expect(data).toEqual(before);expect(data.insights[0].purchases).toBeNull();
  });
  it('respeita período, moeda, conta e escopo de produto',()=>{
    for(const change of [{end:'2026-11-10'},{currency:'USD'},{account:'outro'},{product:'produto'}])expect(metaSupplements(make(),{...filters,...change})).toEqual([]);
  });
  it('usa última revisão do mesmo recorte sem duplicar e mantém ausência como indisponível',()=>{
    const data=make();data.manualMetaSupplementalExports!.push({...data.manualMetaSupplementalExports![0],sha256:'b',importedAt:'2026-11-12T16:00:00Z',rows:[{...row,purchases:null,purchaseValue:null}]});
    const list=metaSupplements(data,filters);expect(list).toHaveLength(1);expect(list[0].sha256).toBe('b');expect(list[0].purchases).toBeNull();expect(list[0].roas).toBeNull();expect(list[0].cpa).toBeNull();
  });
});
