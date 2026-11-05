import type {ReactNode} from 'react';
export const number=(value:number|null)=>value===null?'—':value.toLocaleString('pt-BR',{maximumFractionDigits:0});
export const ratio=(value:number|null)=>value===null?'—':value.toLocaleString('pt-BR',{minimumFractionDigits:2,maximumFractionDigits:2})+'×';
export const percent=(value:number|null)=>value===null?'—':value.toLocaleString('pt-BR',{maximumFractionDigits:1})+'%';
export const date=(value:string)=>value.split('-').reverse().join('/');
export const compact=(value:number)=>Intl.NumberFormat('pt-BR',{notation:'compact',maximumFractionDigits:1}).format(value);
export function Metric({label,value,detail,accent=false}:{label:string;value:string;detail:string;accent?:boolean}) {
  return <article className={`board-metric ${accent?'board-metric-accent':''}`}><span>{label}</span><strong>{value}</strong><small>{detail}</small></article>;
}
export function Panel({title,subtitle,children,className=''}:{title:string;subtitle:string;children:ReactNode;className?:string}) {
  return <section className={`board-panel ${className}`}><div className="board-panel-title"><h3>{title}</h3><span>{subtitle}</span></div>{children}</section>;
}
