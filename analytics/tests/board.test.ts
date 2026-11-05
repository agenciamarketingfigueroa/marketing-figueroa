import {afterEach,expect,it,vi} from 'vitest';
import {renderToStaticMarkup} from 'react-dom/server';
import {createElement} from 'react';
import {OperationBoard} from '../src/components/operation-board';
import {demoDataset} from '../src/lib/demo';
import type {Dataset} from '../src/lib/domain';

afterEach(()=>vi.unstubAllGlobals());
function render(data:Dataset) {
  vi.stubGlobal('window',{matchMedia:()=>({matches:true})});
  vi.stubGlobal('document',{hidden:false});
  return renderToStaticMarkup(createElement(OperationBoard,{data,onRefresh:async()=>{},onLogout:()=>{}}));
}
function fixture():Dataset {
  const data=demoDataset();
  return {...data,mode:'manual',manualPeriods:[{start:'2026-09-01',end:'2026-09-30',month:'Setembro',sources:[]}],
    insights:[{...data.insights[0],date:'2026-09-01',periodEnd:'2026-09-30',spend:10000,purchaseValue:25000}],
    orders:[{...data.orders[0],currency:'BRL',purchasedAt:'2026-09-30T12:00:00-03:00',approvedAt:null,status:'COMPLETE',gross:30000,net:27000}],
    coverage:{meta:[],hotmart:[{start:Date.parse('2026-09-01T00:00:00-03:00'),end:Date.parse('2026-09-30T23:59:59.999-03:00')}]}};
}
it('oferece cinco lâminas e mantém mídia mensal indisponível na leitura diária',()=>{
  const html=render(fixture());
  expect((html.match(/class="board-slide /g)||[])).toHaveLength(5);
  expect((html.match(/aria-hidden="true" inert=""/g)||[])).toHaveLength(4);
  expect(html).toContain('2,50×');
  expect(html).toContain('Investimento do dia</span><strong>—</strong>');
  expect(html).toContain('ROAS Meta do dia</span><strong>—</strong>');
  expect(html).toContain('Reproduzir apresentação');
  expect(html).toContain('importação manual');
});
it('preenche investimento e ROAS do dia quando o export possui cobertura diária',()=>{
  const data=fixture();
  data.manualPeriods=[{start:'2026-09-30',end:'2026-09-30',month:'Setembro 30',sources:[]}];
  data.insights[0].date='2026-09-30';data.insights[0].periodEnd='2026-09-30';
  const html=render(data);
  expect(html).toContain('ROAS Meta do dia</span><strong>2,50×</strong>');
  expect(html).not.toContain('Investimento do dia</span><strong>—</strong>');
});
it('renderiza ausência de dados sem inventar totais ou quebrar as lâminas',()=>{
  const data=fixture();data.orders=[];data.insights=[];data.coverage={meta:[],hotmart:[]};data.instagramDaily=[];
  const html=render(data);
  expect(html).toContain('Receita bruta</span><strong>—</strong>');
  expect(html).toContain('Novos seguidores</span><strong>—</strong>');
  expect(html).not.toMatch(/NaN|Infinity/);
});
