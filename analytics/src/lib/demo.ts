import { type Dataset, type Order, shiftDay,daysBetween } from './domain';
import { OPERATION_START } from './operation';

/** Synthetic fixture only. Never written to the operational database. */
export function demoDataset(): Dataset {
  const data: Dataset = {
    organizationId: 'demo', organization: 'Mvave BR', mode: 'demo',
    accounts: [{ id: 'demo-meta', name: 'Mvave BR · demonstração' }], orders: [], insights: [], followers: [], creatives: [0,1,2].map(i=>({accountId:'demo-meta',adId:'a'+i,creativeId:'demo-creative-'+i,name:'Criativo de demonstração '+(i+1),imageUrl:null,videoId:'demo-video-'+i,kind:'VIDEO'})),
    mappings: [0, 1, 2].map(i => ({ sourceKey: 'sck', sourceValue: `demo-ad-${i}`, hotmartAccountId:'demo-hotmart', productId: i === 2 ? 'p2' : 'p1', offer: null, accountId: 'demo-meta', campaignId: `c${i}`, adsetId: `s${i}`, adId: `a${i}` })),
    sync: [{provider:'instagram', status:'pending', lastSuccess:null, message:'Demonstração · seguidores fictícios'}, {provider:'meta', status:'pending', lastSuccess:null, message:'Demonstração · sem conexão'}, {provider:'hotmart', status:'pending', lastSuccess:null, message:'Demonstração · sem conexão'}],
  };
  const names = ['Escala · Presets essenciais', 'Remarketing · Quem já conhece', 'Aquisição · Primeiros acordes'];
  for (let d = 0; d < daysBetween(OPERATION_START,'2026-11-01'); d++) {
    const day = shiftDay(OPERATION_START, d);
    data.followers!.push({accountId:'demo-instagram',username:'mvave_demo',date:day,followers:1240+d*12+Math.floor(d/7)*8,observedAt:day+'T18:00:00Z'});
    for (let c = 0; c < 3; c++) {
      const spend = 6000 + ((d * 137 + c * 911) % 7000);
      data.insights.push({date:day, accountId:'demo-meta', campaignId:`c${c}`, campaign:names[c], adsetId:`s${c}`, adset: ['Interesses · Guitarra', 'Visitantes · 30 dias', 'Público amplo'][c], adId:`a${c}`, ad:`Criativo ${c + 1} · Vídeo`, status:c === 2 ? 'PAUSED' : 'ACTIVE', currency:'BRL', spend, impressions:1900 + d * 29 + c * 103, clicks:73 + d % 31, views:57 + d % 23, checkouts:12 + d % 8, purchases:4 + d % 5, purchaseValue:(4 + d % 5) * 9700, reach:1700 + d * 20});
    }
    for (let n = 0; n < 9 + d % 8; n++) {
      const productId = n % 4 === 0 ? 'p2' : 'p1';
      const currency = n === 0 && d % 7 === 0 ? 'USD' : 'BRL';
      const gross = currency === 'USD' ? 1900 : productId === 'p1' ? 9700 : 14700;
      const status: Order['status'] = n === 1 && d % 5 === 0 ? 'REFUNDED' : n === 2 && d % 4 === 0 ? 'WAITING_PAYMENT' : 'APPROVED';
      data.orders.push({transaction:`DEMO-${d}-${n}`, accountId:'demo-hotmart', productId, product:productId === 'p1' ? 'Presets essenciais' : 'Primeiros acordes', offer:'demo-offer', status, purchasedAt:`${day}T15:00:00Z`, approvedAt:status === 'WAITING_PAYMENT' ? null : `${day}T15:04:00Z`, currency, gross, net:Math.round(gross * .86), payment:n % 3 === 0 ? 'PIX' : 'CREDIT_CARD', source:n % 5 === 0 ? {} : {sck:`demo-ad-${productId === 'p2' ? 2 : n % 2}`}, parentTransaction:null, isBump:false, isFunnel:false});
    }
  }
  return data;
}
