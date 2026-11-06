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

export function parseDailyMeta(rows,period) {
  required(rows.length>1,'Export Meta diário vazio');
  const columns=new Map(Object.entries(rows[0]).map(([col,name])=>[name,col]));
  if(columns.has('Compras')&&columns.has('Identificação do anúncio')&&!columns.has('Nome do conjunto de anúncios'))return parseDetailedDailyMeta(rows,period,columns);
  for(const name of ['Início dos relatórios','Encerramento dos relatórios','Nome do anúncio','Nome do conjunto de anúncios','Valor gasto (BRL)','Impressões','Resultados','Indicador de resultados'])required(columns.has(name),'Coluna diária ausente: '+name);
  const groups=new Map(),days=new Set();
  for(const row of rows.slice(1)) {
    const get=name=>row[columns.get(name)];
    const day=get('Início dos relatórios'),name=get('Nome do anúncio')?.trim(),adset=get('Nome do conjunto de anúncios')?.trim();
    required(/^\d{4}-\d{2}-\d{2}$/.test(day)&&day===get('Encerramento dos relatórios')&&day>=period.start&&day<=period.end&&name&&adset,'Data, nome ou conjunto diário inválido');
    const indicator=get('Indicador de resultados');
    required(!indicator||indicator==='actions:offsite_conversion.fb_pixel_purchase','Indicador diário inesperado');
    required(indicator||!get('Resultados'),'Resultado diário sem indicador');
    const adId='daily-'+hash(JSON.stringify([adset,name])),key=day+'|'+adId;
    const result=groups.get(key)??{date:day,periodEnd:day,accountId:'manual-meta',campaignId:'manual',campaign:'Campanha não informada no export',adsetId:'name-'+hash(adset),adset,adId,ad:name,status:'UNKNOWN',currency:'BRL',spend:0,impressions:0,purchases:0,clicks:null,views:null,checkouts:null,purchaseValue:null,reach:null};
    result.spend+=cents(get('Valor gasto (BRL)'),'gasto diário');result.impressions+=count(get('Impressões'),'impressões diárias');result.purchases+=indicator?count(get('Resultados'),'compras diárias'):0;
    for(const field of ['spend','impressions','purchases'])required(Number.isSafeInteger(result[field]),'Total fora do limite');
    groups.set(key,result);days.add(day);
  }
  for(let day=period.start;day<=period.end;day=new Date(Date.parse(day+'T12:00:00Z')+86400000).toISOString().slice(0,10))required(days.has(day),'Dia ausente no export Meta: '+day);
  const insights=[...groups.values()].sort((a,b)=>a.date.localeCompare(b.date)||a.adId.localeCompare(b.adId));
  return {insights,totals:Object.fromEntries(['spend','impressions','purchases'].map(field=>[field,insights.reduce((sum,r)=>sum+r[field],0)])),sourceRows:rows.length-1};
}

function parseDetailedDailyMeta(rows,period,columns) {
  for(const name of ['Início dos relatórios','Encerramento dos relatórios','Nome do anúncio','Valor gasto (BRL)','Compras','Cliques no link','Visualizações da página de destino do site','Finalizações de compra iniciadas','Valor de conversão da compra'])required(columns.has(name),'Coluna diária ausente: '+name);
  const days=new Set(),ids=new Set();
  const insights=rows.slice(1).map(row=>{
    const get=name=>row[columns.get(name)];
    const day=get('Início dos relatórios'),name=get('Nome do anúncio')?.trim(),exportAdId=get('Identificação do anúncio');
    required(/^\d{4}-\d{2}-\d{2}$/.test(day)&&day===get('Encerramento dos relatórios')&&day>=period.start&&day<=period.end&&name,'Data ou nome diário inválido');
    required(/^\d+(?:\.\d+E\+\d+)?$/i.test(exportAdId??''),'Identificador Meta inválido');
    const idPrecision=/E/i.test(exportAdId)?'rounded':'exact',adId='daily-id-'+hash(exportAdId),key=day+'|'+adId;
    required(!ids.has(key),'ID Meta diário duplicado ou colisão de arredondamento');ids.add(key);days.add(day);
    const purchases=count(get('Compras'),'compras diárias');
    if(purchases>0)required(get('Valor de conversão da compra'),'Compras sem valor de conversão');
    return {date:day,periodEnd:day,accountId:'manual-meta',campaignId:'manual',campaign:'Campanha não informada no export',adsetId:'manual',adset:'Conjunto não informado no export',adId,ad:name,status:get('Veiculação de anúncio')==='active'?'ACTIVE':get('Veiculação de anúncio')==='paused'?'PAUSED':'UNKNOWN',currency:'BRL',spend:cents(get('Valor gasto (BRL)'),'gasto diário'),impressions:columns.has('Impressões')?count(get('Impressões'),'impressões'):null,clicks:count(get('Cliques no link'),'cliques'),views:count(get('Visualizações da página de destino do site'),'visitas'),checkouts:count(get('Finalizações de compra iniciadas'),'checkouts'),purchases,purchaseValue:get('Valor de conversão da compra')?cents(get('Valor de conversão da compra'),'conversão'):0,reach:null,exportAdId,idPrecision};
  });
  for(let day=period.start;day<=period.end;day=new Date(Date.parse(day+'T12:00:00Z')+86400000).toISOString().slice(0,10))required(days.has(day),'Dia ausente no export Meta: '+day);
  return {insights,totals:Object.fromEntries(['spend','impressions','purchases'].map(field=>[field,insights.every(r=>r[field]!==null)?insights.reduce((sum,r)=>sum+r[field],0):null])),sourceRows:rows.length-1};
}
