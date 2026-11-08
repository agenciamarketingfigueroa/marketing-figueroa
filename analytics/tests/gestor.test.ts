import {describe,it,expect} from 'vitest';
import {clientReport,reportHtml} from '../src/lib/client-report';
import {analyzeOperation} from '../src/lib/gestor';
import type {Dataset} from '../src/lib/domain';
const data:Dataset={organizationId:'test',organization:'Cliente <X>',mode:'manual',orders:[],insights:[],mappings:[],sync:[],accounts:[],coverage:{meta:[],hotmart:[]}};
describe('Gestor e relatório do cliente',()=>{
  it('não transforma falta de cobertura em resultado ou comparação',()=>{const a=analyzeOperation(data,'2026-11-07','daily');expect(a.comparable).toBe(false);expect(a.windows.every(w=>!w.available)).toBe(true);expect(a.previous.end).toBe('2026-11-06');});
  it('cadência semanal compara janelas iguais',()=>{const a=analyzeOperation(data,'2026-11-07','weekly');expect(a.current.start).toBe('2026-11-01');expect(a.previous.start).toBe('2026-10-25');});
  it('export respeita filtros, marca lacunas e escapa HTML',()=>{const r=clientReport(data,{start:'2026-11-06',end:'2026-11-07',account:'all',product:'all',currency:'BRL'});expect(r.text).toContain('Cobertura incompleta');expect(r.metrics.find(x=>x[0]==='Pedidos principais')?.[1]).toBe('—');expect(reportHtml(r)).toContain('Cliente &lt;X&gt;');expect(reportHtml(r)).not.toContain('<X>');});
});
