import {type Dataset,type Filters,divide,money} from '../lib/domain';
import {metaSupplements} from '../lib/meta-supplements';
import './meta-supplements.css';

const num=(n:number|null)=>n===null?'—':n.toLocaleString('pt-BR');
const ratio=(n:number|null)=>n===null?'—':n.toLocaleString('pt-BR',{minimumFractionDigits:2,maximumFractionDigits:2})+'×';
export function MetaSupplements({data,filters}:{data:Dataset;filters:Filters}){
  return <>{metaSupplements(data,filters).map(s=><aside className="meta-supplement" key={s.sha256} aria-label="Complemento Meta com cobertura parcial">
    <strong>{s.date.split('-').reverse().join('/')} · Export filtrado · {s.rows.length} anúncios</strong>
    <p>Recorte: {money(s.spend,filters.currency)} de {money(s.knownSpend,filters.currency)} de mídia registrada no dia · {num(s.purchases)} compras Meta · ROAS {ratio(s.roas)} · CPA {money(s.cpa,filters.currency)}.</p>
    <p>Filtro: {s.filter}. Os resultados abaixo não completam os totais do período. O gasto e as impressões do export anterior foram preservados.</p>
    <details><summary>Ver funil e resultados do recorte</summary>
      <p>{num(s.clicks)} cliques · {num(s.views)} visitas à página · {num(s.checkouts)} checkouts · {money(s.value,filters.currency)} em valor de conversão reportado pela Meta.</p>
      <div className="meta-supplement-table"><table><thead><tr>{['Anúncio','Mídia','Compras Meta','ROAS Meta'].map(h=><th key={h}>{h}</th>)}</tr></thead><tbody>{s.rows.map(r=><tr key={r.adId}><td>{r.ad}</td><td>{money(r.spend,r.currency)}</td><td>{num(r.purchases)}</td><td>{ratio(divide(r.purchaseValue,r.spend))}</td></tr>)}</tbody></table></div>
      <p>Compras Meta não equivalem a compradores Hotmart. IDs sem precisão comprovada não autorizam atribuição SCK. Importar o dia com todos os anúncios e métricas para completar o fechamento.</p>
    </details>
  </aside>)}</>;
}
