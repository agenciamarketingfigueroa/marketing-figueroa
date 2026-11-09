import {beforeEach,afterEach,describe,it,expect,vi} from 'vitest';
import {createAnalysisActions} from '../manual/analysis-history';
import type {AnalysisEntry} from '../src/lib/analysis-history';
const entries=new Map<string,string>();
const proposal:AnalysisEntry={id:'p1',createdAt:'2026-11-08T18:00:00Z',organizationId:'mvave-br',currency:'BRL',start:'2026-11-06',end:'2026-11-07',type:'proposed',target:'Criativo privado',targetKey:'meta|ad1',decision:'Manter sob observação',reason:'Amostra insuficiente',budget:null,sources:['source-hash']};
beforeEach(()=>{entries.clear();vi.stubGlobal('localStorage',{getItem:(k:string)=>entries.get(k)??null,setItem:(k:string,v:string)=>entries.set(k,v)});});
afterEach(()=>vi.unstubAllGlobals());
describe('Histórico de propostas separado da execução',()=>{
  it('criptografa registros, separa clientes e exige proposta antes de aprovar',async()=>{
    const actions=createAnalysisActions('test-key-only','mvave-br',()=>{});
    await expect(actions.append([{...proposal,id:'a1',type:'approved',proposalId:'missing'}])).rejects.toThrow('PROPOSAL_REQUIRED');
    await actions.append([proposal]);expect([...entries.values()].join('')).not.toContain('Criativo privado');
    await actions.append([{...proposal,id:'a1',type:'approved',proposalId:'p1'}]);
    expect((await actions.load()).map(e=>e.type)).toEqual(['proposed','approved']);
    expect(await createAnalysisActions('test-key-only','other',()=>{}).load()).toEqual([]);
  });
  it('não registra execução sem evidência nem aceita duplicar histórico',async()=>{
    const actions=createAnalysisActions('test-key-only','mvave-br',()=>{});await actions.append([proposal]);
    await expect(actions.append([proposal])).rejects.toThrow('INVALID_ENTRY');
    await expect(actions.append([{...proposal,id:'e1',type:'execution-reported',proposalId:'p1'}])).rejects.toThrow('EVIDENCE_REQUIRED');
    await actions.append([{...proposal,id:'e1',type:'execution-reported',proposalId:'p1',evidence:'Relato do responsável; conferir próximo export'}]);
    expect((await actions.load())[1].type).toBe('execution-reported');
  });
  it('falha de sessão impede ler ou alterar dados existentes',async()=>{
    const actions=createAnalysisActions('test-key-only','mvave-br',()=>{throw Error('SESSION_EXPIRED');});
    await expect(actions.append([proposal])).rejects.toThrow('SESSION_EXPIRED');expect(entries.size).toBe(0);
  });
});
