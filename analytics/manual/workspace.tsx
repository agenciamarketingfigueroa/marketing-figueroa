import {useState,type ReactNode} from 'react';
import type {Dataset} from '../src/lib/domain';
import {scopeMvave} from '../src/lib/strategic-report';
import operations from './operations.json';
import './workspace.css';
export function OperationWorkspace({data,clients={},render}:{data:Dataset;clients?:Record<string,Dataset>;render:(data:Dataset,control:ReactNode)=>ReactNode}){
  const [selected,setSelected]=useState('');
  const operation=operations.find(o=>o.id===selected);
  const dataset=selected==='mvave-br'?data:clients[selected];
  const control=<label className="operation-control">Cliente / operação<select aria-label="Cliente / operação" value={selected} onChange={e=>setSelected(e.target.value)}><option value="">Selecione uma operação</option>{operations.map(o=><option value={o.id} key={o.id}>{o.name}</option>)}</select></label>;
  const navigation=<nav className="operation-links"><a href="area-interna.html">Área Interna</a><a href="clientes/analytics/">Analytics</a><a href="clientes/painel/">Painel</a></nav>;
  if(!selected)return <main className="operation-gate"><span className="eyebrow">MARKETING FIGUEROA / CENTRAL DE CLIENTES</span><h1>Qual operação vamos acompanhar?</h1><p>Escolha o cliente antes de abrir seus dados e recomendações.</p>{control}<div className="operation-cards">{operations.map(o=><button key={o.id} onClick={()=>setSelected(o.id)}><strong>{o.name}</strong><span>{o.cadence==='daily'?'Análise diária':'Análise semanal'}</span><small>{o.objective}</small></button>)}</div><p>O perfil da nova cliente será criado após a reunião de 09/11.</p>{navigation}</main>;
  if(!dataset)return <main className="operation-gate">{control}<h1>{operation?.name}</h1><p>Aguardando os primeiros relatórios deste cliente. Nenhum resultado foi importado.</p>{navigation}</main>;
  return <div key={selected}>{render(selected==='mvave-br'?scopeMvave(dataset).data:dataset,control)}</div>;
}
