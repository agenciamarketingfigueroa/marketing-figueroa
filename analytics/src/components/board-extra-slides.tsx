'use client';
import {useEffect,useMemo,useState} from 'react';
import {CartesianGrid,Line,LineChart,ResponsiveContainer,Tooltip,XAxis,YAxis} from 'recharts';
import {type Dataset,type Filters,daysBetween,fractionDigits,money,variation} from '@/lib/domain';
import {type Forecast,type ForecastActions,buildForecast,forecastActual,forecastRatios,forecastScenario,monthRange,nextMonth,productPerformance} from '@/lib/board-analysis';
import {reportMetrics} from '@/lib/report-metrics';
import {dailyPerformance} from '@/lib/performance';
import {CreativeGallery} from './performance-panels';
import {Metric,Panel,compact,date,number,percent,ratio} from './board-ui';

const monthName=(month:string)=>new Intl.DateTimeFormat('pt-BR',{month:'long',year:'numeric',timeZone:'UTC'}).format(new Date(month+'-01T12:00:00Z'));

export function ProductsSlide({data,filters,today,page}:{data:Dataset;filters:Filters;today:string;page?:number}) {
  const products=useMemo(()=>productPerformance(data,filters,today),[data,filters,today]);
  const {metrics,hotmartCovered}=reportMetrics(data,filters,today);
  const cash=(value:number|null)=>money(value,filters.currency);
  const total=products.reduce((sum,p)=>sum+p.sales,0);
  return <div>{page===undefined&&<div className="board-metrics four"><Metric label="Produtos com vendas" value={number(products.length)} detail={hotmartCovered?'Produtos aprovados no período':'Somente registros recebidos'} accent/><Metric label="Receita dos produtos" value={cash(metrics.gross)} detail="Receita bruta aprovada · Hotmart"/><Metric label="Receita líquida" value={cash(metrics.net)} detail="Líquido informado pela Hotmart"/><Metric label="CPA Meta da operação" value={cash(metrics.cpa)} detail="Gasto ÷ compras Meta; todas as ofertas"/></div>}
    {products.length>0?<>{page===undefined?<><div className="board-product-podium">{products.slice(0,3).map((p,index)=><article key={p.key} className={`board-product-winner ${index===0?'is-leader':''}`}><span className="board-eyebrow">{index===0?'01 / MAIS VENDIDO':`0${index+1} / EM DESTAQUE`}</span><h3>{p.name}</h3><strong>{number(p.sales)} <small>vendas</small></strong><div className="board-track"><i style={{width:`${total?p.sales/total*100:0}%`}}/></div><p>{percent(total?p.sales/total*100:null)} das vendas aprovadas</p><dl><div><dt>Receita bruta</dt><dd>{cash(p.gross)}</dd></div><div><dt>Receita líquida</dt><dd>{cash(p.net)}</dd></div><div><dt>CPA Meta vinculado</dt><dd>{cash(p.cpa)}</dd></div></dl></article>)}</div><p className="board-footnote">CPA por produto exige vínculo exclusivo com os anúncios. Sem vínculo confiável, aparece “—”.</p></>:<Panel title="Ranking de produtos" subtitle={`Produtos ${page*6+1}–${Math.min((page+1)*6,products.length)} de ${products.length} · por vendas`}><div className="board-table-wrap"><table className="board-table board-product-table"><thead><tr><th>Produto</th><th>Vendas</th><th>Receita bruta</th><th>Receita líquida</th><th>Ticket médio</th><th>CPA Meta vinculado</th></tr></thead><tbody>{products.slice(page*6,(page+1)*6).map((p,i)=><tr key={p.key}><td><span className="board-rank">{String(page*6+i+1).padStart(2,'0')}</span> {p.name}</td><td>{number(p.sales)}</td><td>{cash(p.gross)}</td><td>{cash(p.net)}</td><td>{cash(p.gross/p.sales)}</td><td>{cash(p.cpa)}</td></tr>)}</tbody></table></div><p className="board-footnote">CPA vinculado = gasto ÷ compras dos anúncios com vínculo exclusivo e verificável com o produto. Sem esse vínculo, aparece “—”. O CPA da operação não é distribuído entre os produtos.{!hotmartCovered?' Cobertura parcial: ranking apenas dos registros recebidos.':''}</p></Panel>}</>:<Panel title="Produtos mais vendidos" subtitle={filters.currency}><p className="board-empty">Nenhuma venda aprovada entre os registros recebidos neste período e moeda.</p></Panel>}
  </div>;
}

export function CreativesSlide({data,filters,today}:{data:Dataset;filters:Filters;today:string}) {
  const covered=reportMetrics(data,filters,today).metaCovered;
  return <div className="board-creatives">{covered?<CreativeGallery data={data} filters={filters} limit={4}/>:<Panel title="Melhores criativos" subtitle="Meta Ads"><p className="board-empty">Selecione um período completo de mídia e uma moeda com cobertura para comparar os criativos.</p></Panel>}</div>;
}

export function useBoardForecasts(data:Dataset,currency:string,today:string,actions?:ForecastActions) {
  const upcoming=nextMonth(today);
  const [selected,setSelected]=useState('');
  const [saved,setSaved]=useState<Forecast[]>([]);
  const [ready,setReady]=useState(!actions);
  const [busy,setBusy]=useState(false);
  const [message,setMessage]=useState('');
  useEffect(()=>{
    let active=true;
    if(actions)void actions.load().then(rows=>{if(active){setSaved(rows);setReady(true);}}).catch(()=>{if(active){setReady(false);setMessage('Não foi possível ler as projeções salvas. A cópia local foi preservada.');}});
    return()=>{active=false;};
  },[actions]);
  const relevant=saved.filter(f=>f.currency===currency&&f.organizationId===data.organizationId);
  const targets=[...new Set([upcoming,...relevant.map(f=>f.target)])].sort().reverse();
  const target=targets.includes(selected)?selected:upcoming;
  const frozen=relevant.find(f=>f.target===target);
  const draft=useMemo(()=>buildForecast(data,currency,target,today),[data,currency,target,today]);
  const forecast=frozen??draft;
  async function run(action:()=>Promise<void>) {setBusy(true);try{await action();}catch{setMessage('Não foi possível concluir. Confira o arquivo e o armazenamento do navegador; a projeção anterior foi preservada.');}finally{setBusy(false);}}
  return {target,targets,frozen,forecast,relevant,ready,busy,message,saved,setSelected,setSaved,setMessage,run};
}

export function ProjectionsSlide({data,today,actions,state,view}:{data:Dataset;today:string;actions?:ForecastActions;state:ReturnType<typeof useBoardForecasts>;view:'overview'|'comparison'|'method'}) {
  const {target,targets,frozen,forecast,relevant,ready,busy,message,saved,setSelected,setSaved,setMessage,run}=state;
  return <div><div className="board-forecast-toolbar"><div><span className="board-eyebrow">{frozen?'PROJEÇÃO FIXADA':'PRÉVIA DA PROJEÇÃO'}</span><h2>{monthName(target)}</h2><p>Base própria de meses fechados · independente do filtro de período acima</p></div><div className="board-forecast-actions"><label>Mês projetado<select aria-label="Mês projetado" value={target} onChange={e=>setSelected(e.target.value)}>{targets.map(value=><option key={value} value={value}>{monthName(value)}{relevant.some(f=>f.target===value)?' · fixada':''}</option>)}</select></label><button disabled={!actions||!ready||busy||!forecast||Boolean(frozen)} onClick={()=>void run(async()=>{setSaved(await actions!.save(forecast!));setMessage('Projeção fixada neste navegador. Novas importações atualizarão apenas o realizado. Baixe uma cópia para guardar.');})}>{frozen?'Projeção fixada':'Fixar projeção'}</button></div></div>
    {message&&<p className="board-coverage" role="status">{message}</p>}
    {forecast?<ForecastContent data={data} forecast={forecast} today={today} frozen={Boolean(frozen)} view={view}/>:<Panel title="Aguardando uma base completa" subtitle="Projeção do próximo mês"><p className="board-empty">É necessário ao menos um mês calendário completo de Hotmart nos últimos seis meses, nesta moeda. Meses parciais não entram na estimativa.</p></Panel>}
    {view==='method'&&<div className="board-forecast-storage"><p>{frozen?`Fixada em ${date(frozen.createdOn)}. `:'Fixe a projeção para preservar os valores antes de receber os resultados. '}As projeções ficam criptografadas neste navegador; baixe uma cópia para usar em outro dispositivo.</p>{actions&&<div><button disabled={busy||!ready||!saved.length} onClick={()=>void run(async()=>{await actions.download();setMessage('Cópia criptografada de todas as projeções baixada.');})}>Baixar projeções</button><label className="board-file-button">Restaurar projeções<input aria-label="Restaurar projeções" type="file" accept=".json" disabled={busy||!ready} onChange={e=>{const file=e.target.files?.[0];e.target.value='';if(file)void run(async()=>{setSaved(await actions.restore(file));setMessage('Projeções restauradas. Projeções já fixadas neste navegador foram mantidas.');});}}/></label></div>}</div>}
  </div>;
}

function ForecastContent({data,forecast:f,today,frozen,view}:{data:Dataset;forecast:Forecast;today:string;frozen:boolean;view:'overview'|'comparison'|'method'}) {
  const cash=(value:number|null)=>money(value,f.currency);
  const range=monthRange(f.target),days=daysBetween(range.start,range.end),factor=10**fractionDigits(f.currency);
  const actual=useMemo(()=>forecastActual(data,f,today),[data,f,today]);
  const daily=useMemo(()=>dailyPerformance(data,{...monthRange(f.target),currency:f.currency,account:'all',product:'all'},today),[data,f,today]);
  const scenarios=[{name:'Conservador',multiplier:.8},{name:'Base',multiplier:1},{name:'Otimista',multiplier:1.2}];
  const rows=daily.map((row,i)=>({label:row.label,base:Math.round(f.base.gross!*(i+1)/days)/factor,low:Math.round(f.base.gross!*.8*(i+1)/days)/factor,high:Math.round(f.base.gross!*1.2*(i+1)/days)/factor,actual:row.day<today?row.cumulativeRevenue:null}));
  const comparison=[{key:'gross',label:'Receita bruta',actual:actual.hotmart,money:true},{key:'sales',label:'Vendas aprovadas',actual:actual.hotmart,money:false},{key:'spend',label:'Investimento',actual:actual.meta,money:true},{key:'purchases',label:'Compras Meta',actual:actual.meta,money:false}] as const;
  const ratios=forecastRatios(f.base);
  return <>{view==='overview'&&<><div className="board-metrics four"><Metric label="Receita projetada" value={cash(f.base.gross)} detail={`${days} dias · cenário base`} accent/><Metric label="Vendas projetadas" value={number(f.base.sales)} detail="Vendas aprovadas · Hotmart"/><Metric label="Investimento estimado" value={cash(f.base.spend)} detail="Mantém o ritmo diário de mídia da base"/><Metric label="CPA Meta estimado" value={cash(ratios.cpa)} detail={`Gasto ÷ compras Meta · MER ${ratio(ratios.mer)}`}/></div>
    <div className="board-two-columns board-projection-columns"><Panel title="Receita acumulada · previsto × realizado" subtitle={`${monthName(f.target)} · ${f.currency}`}><div className="board-chart" role="img" aria-label="Receita acumulada projetada nos cenários conservador, base e otimista, comparada ao realizado. Valores realizados ausentes permanecem em branco."><ResponsiveContainer width="100%" height="100%" minWidth={0}><LineChart data={rows} margin={{top:15,right:15,bottom:0,left:0}}><CartesianGrid stroke="#ffffff0c" vertical={false}/><XAxis dataKey="label" tick={{fill:'#8e9998',fontSize:11}} minTickGap={35} axisLine={false} tickLine={false}/><YAxis tickFormatter={compact} tick={{fill:'#8e9998',fontSize:11}} axisLine={false} tickLine={false} width={52}/><Tooltip contentStyle={{background:'#182020',border:'1px solid #394543',borderRadius:12}} formatter={(value,name)=>[cash(Math.round(Number(value)*factor)),name]}/><Line dataKey="low" name="Conservador" stroke="#77876f" strokeDasharray="3 5" dot={false} isAnimationActive={false}/><Line dataKey="high" name="Otimista" stroke="#baa1ff" strokeDasharray="3 5" dot={false} isAnimationActive={false}/><Line dataKey="base" name="Base projetada" stroke="#b9f46b" strokeWidth={2.5} strokeDasharray="6 4" dot={false} isAnimationActive={false}/><Line dataKey="actual" name="Realizado" stroke="#ff935d" strokeWidth={3} dot={false} connectNulls={false} isAnimationActive={false}/></LineChart></ResponsiveContainer></div><div className="board-forecast-legend"><span>● Base projetada</span><span>● Realizado</span><span>┄ Conservador −20%</span><span>┄ Otimista +20%</span></div><p className="board-footnote">A linha prevista distribui a estimativa mensal igualmente pelos dias. O realizado usa dias fechados com cobertura contínua; lacunas permanecem vazias.</p></Panel>
    <Panel title="Três cenários para planejar" subtitle="Sensibilidade do resultado · mesmo investimento"><div className="board-scenarios">{scenarios.map(s=>{const values=forecastScenario(f,s.multiplier);return <article key={s.name} className={s.multiplier===1?'is-base':''}><span>{s.name}<small>{s.multiplier===1?'Ritmo histórico':s.multiplier<1?'Resultado −20%':'Resultado +20%'}</small></span><strong>{cash(values.gross)}</strong><p>{number(values.sales)} vendas · CPA {cash(forecastRatios(values).cpa)}</p></article>;})}</div><p className="board-footnote">Cenários de sensibilidade, não intervalos de confiança. Variam receita e volume em ±20%, mantendo o investimento. Não incorporam sazonalidade, promoções ou mudanças futuras de orçamento.</p></Panel></div></>}
    {view==='comparison'&&<Panel title="Acompanhamento da projeção" subtitle={frozen?'Estimativa original preservada':'Prévia · fixe para acompanhar sem recalcular'} className="board-forecast-comparison"><div className="board-table-wrap"><table className="board-table"><thead><tr><th>Indicador</th><th>Previsto no mês</th><th>Previsto até a data</th><th>Realizado</th><th>Desvio do previsto</th></tr></thead><tbody>{comparison.map(row=>{
      const baseline=f.base[row.key];
      const received=row.actual&&row.key in row.actual?(row.actual as unknown as Record<string,number|null>)[row.key]:null;
      const expected=row.actual&&baseline!==null?Math.round(baseline*daysBetween(range.start,row.actual.through)/days):null;
      const format=row.money?cash:number;
      const change=variation(received,expected);
      return <tr key={row.key}><td>{row.label}</td><td>{format(baseline)}</td><td>{format(expected)}<small>{row.actual?`Até ${date(row.actual.through)}`:'Aguardando dados'}</small></td><td>{format(received)}<small>{row.actual?(row.actual.through===range.end?'Mês completo':'Parcial · dias fechados'):'Sem cobertura'}</small></td><td>{change===null?'—':`${change>0?'+':''}${percent(change)}`}</td></tr>;
    })}</tbody></table></div><p className="board-footnote">Desvio = (realizado − previsto até a mesma data) ÷ previsto. Para mídia mensal, o comparativo aguarda um export completo. O mês atual não é tratado como mês fechado.</p></Panel>}
    {view==='method'&&<section className="board-method"><h3>Base e método da estimativa · {f.months.length} {f.months.length===1?'mês completo':'meses completos'}</h3><p>Média diária ponderada: soma dos valores ÷ soma dos dias dos últimos até três meses completos disponíveis nos seis meses anteriores à criação ({date(f.createdOn)}), multiplicada pelos {days} dias de {monthName(f.target)}. Não utiliza dados posteriores à criação.</p><div className="board-table-wrap"><table className="board-table"><thead><tr><th>Mês da base</th><th>Dias</th><th>Receita bruta</th><th>Vendas</th><th>Investimento</th></tr></thead><tbody>{f.months.map(m=><tr key={m.start}><td>{monthName(m.start.slice(0,7))}</td><td>{m.days}</td><td>{cash(m.gross)}</td><td>{number(m.sales)}</td><td>{cash(m.spend)}</td></tr>)}</tbody></table></div><p>{f.months.length<3?'Histórico curto: estimativa baseada em menos de três meses completos. ':''}Último mês usado: {monthName(f.months.at(-1)!.start.slice(0,7))}. Sem cobertura Meta em toda a base, investimento e CPA ficam indisponíveis.</p></section>}
  </>;
}
