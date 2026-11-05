import {createHash} from 'node:crypto';
const hash=value=>createHash('sha256').update(value).digest('hex').slice(0,16);
const required=(value,message)=>{if(!value)throw Error(message);};
function count(value,label) {
  if(value===undefined||value==='')return 0;
  required(/^\d+$/.test(value)&&Number.isSafeInteger(Number(value)),`Contagem inválida: ${label}`);
  return Number(value);
}
function cents(value,label) {
  const match=String(value??'').match(/^(\d+)(?:\.(\d{1,2}))?$/);
  required(match,`Valor monetário inválido: ${label}`);
  const result=Number(BigInt(match[1])*100n+BigInt((match[2]||'').padEnd(2,'0')));
  required(Number.isSafeInteger(result),'Valor monetário fora do limite');return result;
}
export function parseManualMeta(rows,period) {
  required(rows.length>1,'Export Meta vazio');
  const columns=new Map(Object.entries(rows[0]).map(([col,name])=>[name,col]));
  const names={start:'Início dos relatórios',end:'Encerramento dos relatórios',name:'Nome do anúncio',status:'Veiculação de anúncio',spend:'Valor gasto (BRL)',impressions:'Impressões',clicks:'Cliques no link',views:'Visualizações da página de destino do site',checkouts:'Finalizações de compra iniciadas',purchases:'Compras',purchaseValue:'Valor de conversão da compra',followers:'Seguidores no Instagram',account:'Identificação da conta',campaign:'Identificação da campanha',adset:'Identificação do conjunto de anúncios',ad:'Identificação do anúncio'};
  for(const name of Object.values(names))required(columns.has(name),'Coluna Meta ausente: '+name);
  const ids=new Set();let roundedIds=false;
  const insights=rows.slice(1).map(row=>{
    const get=key=>row[columns.get(names[key])];
    required(get('start')===period.start&&get('end')===period.end&&get('name'),'Período ou nome Meta inválido');
    const exported=[get('account'),get('campaign'),get('adset'),get('ad')];
    required(exported.every(id=>/^\d+(?:\.\d+E\+\d+)?$/i.test(id||'')),'Identificador Meta inválido');
    const precision=exported.some(id=>/E/i.test(id))?'rounded':'exact';roundedIds ||= precision==='rounded';
    // Never reconstruct the lost suffix of an identifier stored as a rounded Excel number.
    const internalId='export-'+hash(get('account')+'|'+get('ad'));
    required(!ids.has(internalId),'ID Meta duplicado ou colisão de arredondamento no período');ids.add(internalId);
    const purchases=count(get('purchases'),'compras');
    if(purchases>0)required(get('purchaseValue'),'Compras sem valor de conversão');
    return {date:period.start,periodEnd:period.end,accountId:'manual-meta',campaignId:'export-'+hash(get('campaign')),campaign:'Nome de campanha não exportado',adsetId:'export-'+hash(get('adset')),adset:'Nome de conjunto não exportado',adId:internalId,ad:get('name').trim(),status:get('status')==='active'?'ACTIVE':get('status')==='paused'?'PAUSED':'UNKNOWN',currency:'BRL',spend:cents(get('spend'),'gasto'),impressions:count(get('impressions'),'impressões'),clicks:count(get('clicks'),'cliques'),views:count(get('views'),'visitas'),checkouts:count(get('checkouts'),'checkouts'),purchases,purchaseValue:get('purchaseValue')?cents(get('purchaseValue'),'conversão'):0,reach:null,instagramFollows:count(get('followers'),'seguidores atribuídos'),exportAdId:get('ad'),idPrecision:precision};
  });
  const sum=field=>insights.reduce((total,row)=>total+row[field],0);
  const totals={spend:sum('spend'),impressions:sum('impressions'),clicks:sum('clicks'),views:sum('views'),checkouts:sum('checkouts'),purchases:sum('purchases'),purchaseValue:sum('purchaseValue'),instagramFollows:sum('instagramFollows')};
  return {insights,totals,roundedIds};
}
