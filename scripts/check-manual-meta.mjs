import {test} from 'node:test';
import assert from 'node:assert/strict';
import {parseManualMeta,parseDailyMeta} from './manual-meta.mjs';
const period={start:'2026-09-01',end:'2026-09-30'};
const header={A:'Início dos relatórios',B:'Encerramento dos relatórios',C:'Nome do anúncio',D:'Veiculação de anúncio',G:'Valor gasto (BRL)',AA:'Impressões',N:'Cliques no link',P:'Visualizações da página de destino do site',S:'Finalizações de compra iniciadas',W:'Compras',K:'Valor de conversão da compra',AB:'Seguidores no Instagram',AC:'Identificação da conta',AD:'Identificação da campanha',AE:'Identificação do conjunto de anúncios',AF:'Identificação do anúncio'};
const row={A:period.start,B:period.end,C:'C22 | VIOLAO | NATURALIDADE',D:'active',G:'100.01',AA:'10000',N:'100',P:'75',S:'10',W:'3',K:'130.09',AB:'7',AC:'123',AD:'234',AE:'345',AF:'1.2025143742365E+17'};
test('importa os eventos e centavos sem usar médias das taxas exportadas',()=>{
 const result=parseManualMeta([header,row],period);
 assert.deepEqual(result.totals,{spend:10001,impressions:10000,clicks:100,views:75,checkouts:10,purchases:3,purchaseValue:13009,instagramFollows:7});
 assert.equal(result.insights[0].status,'ACTIVE');
});
test('preserva a referência científica e sinaliza perda de precisão',()=>{
 const result=parseManualMeta([header,row],period);assert.equal(result.roundedIds,true);
 assert.equal(result.insights[0].exportAdId,row.AF);assert.equal(result.insights[0].idPrecision,'rounded');
 assert.match(result.insights[0].adId,/^export-/);
});
test('células de eventos vazias em colunas presentes representam nenhum evento registrado',()=>{
 const result=parseManualMeta([header,{...row,N:'',P:'',S:'',W:'',K:''}],period);
 assert.equal(result.totals.clicks,0);assert.equal(result.totals.purchaseValue,0);
 assert.throws(()=>parseManualMeta([header,{...row,K:''}],period),/sem valor/);
});
test('recusa períodos errados, colunas ausentes e IDs duplicados',()=>{
 assert.throws(()=>parseManualMeta([header,{...row,A:'2026-08-01'}],period),/Período/);
 assert.throws(()=>parseManualMeta([{...header,N:'Cliques (todos)'},row],period),/ausente/);
 assert.throws(()=>parseManualMeta([header,row,row],period),/duplicado/);
});

const dailyHeader={A:'Início dos relatórios',B:'Encerramento dos relatórios',C:'Nome do anúncio',U:'Nome do conjunto de anúncios',K:'Valor gasto (BRL)',L:'Impressões',F:'Resultados',G:'Indicador de resultados'};
const dailyRow={A:'2026-11-01',B:'2026-11-01',C:'Criativo',U:'Conjunto',K:'10.01',L:'100',F:'2',G:'actions:offsite_conversion.fb_pixel_purchase'};
test('consolida grupos diários com nomes repetidos sem inventar métricas ou IDs originais',()=>{
 const result=parseDailyMeta([dailyHeader,dailyRow,{...dailyRow,K:'5.99',F:'1'}],{start:'2026-11-01',end:'2026-11-01'});
 assert.equal(result.insights.length,1);assert.deepEqual(result.totals,{spend:1600,impressions:200,purchases:3});
 assert.equal(result.insights[0].purchaseValue,null);assert.equal(result.insights[0].exportAdId,undefined);assert.equal(result.sourceRows,2);
});
test('não converte dias ausentes em zero nem aceita outro resultado como compra',()=>{
 assert.throws(()=>parseDailyMeta([dailyHeader,dailyRow],{start:'2026-11-01',end:'2026-11-02'}),/Dia ausente/);
 assert.throws(()=>parseDailyMeta([dailyHeader,{...dailyRow,G:'actions:link_click'}],{start:'2026-11-01',end:'2026-11-01'}),/Indicador/);
 assert.throws(()=>parseDailyMeta([dailyHeader,{...dailyRow,B:'2026-11-04'}],{start:'2026-11-01',end:'2026-11-04'}),/diário inválido/);
});

test('importa o export diário detalhado com ROAS/funil e mantém impressões ausentes nulas',()=>{
 const header={A:'Início dos relatórios',B:'Encerramento dos relatórios',C:'Nome do anúncio',G:'Valor gasto (BRL)',U:'Compras',L:'Cliques no link',N:'Visualizações da página de destino do site',Q:'Finalizações de compra iniciadas',W:'Valor de conversão da compra',AA:'Identificação do anúncio'};
 const row={A:'2026-11-05',B:'2026-11-05',C:'Criativo',G:'10.25',U:'2',L:'40',N:'30',Q:'4',W:'59.80',AA:'1.2025143742365E+17'};
 const period={start:'2026-11-05',end:'2026-11-05'};
 const result=parseDailyMeta([header,row],period);
 assert.deepEqual(result.totals,{spend:1025,impressions:null,purchases:2});
 assert.equal(result.insights[0].purchaseValue,5980);assert.equal(result.insights[0].views,30);assert.equal(result.insights[0].clicks,40);assert.equal(result.insights[0].checkouts,4);assert.equal(result.insights[0].idPrecision,'rounded');
 assert.throws(()=>parseDailyMeta([header,row,row],period),/duplicado/);
 assert.throws(()=>parseDailyMeta([header,{...row,W:''}],period),/sem valor/);
});
