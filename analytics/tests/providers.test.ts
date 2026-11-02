import { describe,it,expect,vi } from 'vitest';
import { parseWebhook,parseHistory } from '../src/lib/server/hotmart';
import { parseInsight } from '../src/lib/server/meta';
import { secretMatches,providerJson,boundedJson } from '../src/lib/server/http';

export const webhook=(overrides:Record<string,unknown>={})=>({id:'event-1',creation_date:1793534400000,event:'PURCHASE_APPROVED',version:'2.0.0',data:{
  product:{id:123,name:'Produto teste'},buyer:{email:'discard@example.test',name:'Do not persist'},
  purchase:{transaction:'HP-1',status:'APPROVED',order_date:1793530000000,approved_date:1793534400000,full_price:{value:97,currency_value:'BRL'},price:{value:90,currency_value:'BRL'},payment:{type:'PIX'},origin:{sck:'ad-123'},order_bump:{is_order_bump:true,parent_purchase_transaction:'HP-parent'}},
},...overrides});
describe('Contratos e transporte de provedores',()=>{
  it('valida Hottok sem aceitar ausência',()=>{expect(secretMatches(null,'secret')).toBe(false);expect(secretMatches('','')).toBe(false);expect(secretMatches('bad','secret')).toBe(false);expect(secretMatches('secret','secret')).toBe(true);});
  it('preserva total pago e identifica bump sem replicar total do pai',()=>{
    const event=parseWebhook(webhook(),'account');expect(event.order).toMatchObject({gross:9700,net:null,isBump:true,parentTransaction:'HP-parent',source:{sck:'ad-123'}});
    expect(JSON.stringify(event)).not.toContain('discard@example');expect(JSON.stringify(event)).not.toContain('buyer');
  });
  it('não trata cancelamento de assinatura como reembolso e rejeita versão inválida',()=>{
    expect(parseWebhook(webhook({event:'SUBSCRIPTION_CANCELLATION'}),'account').order).toBeNull();
    expect(()=>parseWebhook(webhook({version:'1.0.0'}),'account')).toThrow();
    expect(()=>parseWebhook(webhook({event:'PURCHASE_REFUNDED'}),'account')).toThrow();
  });
  it('normaliza histórico com origem e moeda sem inferir líquido',()=>{
    const order=parseHistory({product:{id:123,name:'Curso'},purchase:{transaction:'HP-2',status:'COMPLETE',order_date:1793530000000,price:{value:19,currency_code:'USD'},payment:{type:'CREDIT_CARD'},tracking:{source:'src',source_sck:'sck',external_code:'xcod'}}},'account');
    expect(order).toMatchObject({currency:'USD',gross:1900,net:null,source:{src:'src',sck:'sck',xcod:'xcod'}});
  });
  it('não soma aliases de ações Meta e mantém ausências',()=>{
    const base={date_start:'2026-11-01',account_id:'1',account_currency:'BRL',campaign_id:'2',campaign_name:'Campanha',adset_id:'3',adset_name:'Conjunto',ad_id:'4',ad_name:'Anúncio',spend:'12.29',impressions:'1000'};
    const parsed=parseInsight({...base,actions:[{action_type:'purchase',value:'2'},{action_type:'omni_purchase',value:'2'}],action_values:[{action_type:'purchase',value:'194'}]});
    expect(parsed.purchases).toBe(2);expect(parsed.spend).toBe(1229);expect(parsed.purchaseValue).toBe(19400);expect(parseInsight(base).purchases).toBeNull();
  });
  it('limita tamanho do corpo antes de parsear',async()=>{await expect(boundedJson(new Request('https://example.test',{method:'POST',body:'a'.repeat(1024)}),100)).rejects.toThrow('BODY_TOO_LARGE');});
  it('não repete falha de autenticação nem expõe resposta do provedor',async()=>{
    const fetcher=vi.fn().mockResolvedValue(new Response('TOKEN_PRIVADO',{status:401}));
    await expect(providerJson(new URL('https://example.test'),{},Date.now()+10000,fetcher)).rejects.toThrow('PROVIDER_AUTH');expect(fetcher).toHaveBeenCalledTimes(1);
  });
  it('respeita Retry-After acima do orçamento sem fazer nova chamada',async()=>{
    const fetcher=vi.fn().mockResolvedValue(new Response('',{status:429,headers:{'Retry-After':'300'}}));
    await expect(providerJson(new URL('https://example.test'),{},Date.now()+10000,fetcher)).rejects.toThrow('PROVIDER_RATE_LIMIT');expect(fetcher).toHaveBeenCalledTimes(1);
  });
  it('reconhece expiração de token Meta em HTTP 400',async()=>{
    const fetcher=vi.fn().mockResolvedValue(Response.json({error:{code:190,message:'never log token'}},{status:400}));
    await expect(providerJson(new URL('https://graph.facebook.com/v1/test'),{},Date.now()+10000,fetcher)).rejects.toThrow('PROVIDER_AUTH');
  });
  it('faz retry transitório e bloqueia redirects',async()=>{
    vi.useFakeTimers();
    const fetcher=vi.fn().mockResolvedValueOnce(new Response('',{status:503})).mockResolvedValueOnce(Response.json({ok:true}));
    const promise=providerJson(new URL('https://example.test'),{},Date.now()+10000,fetcher);
    await vi.runAllTimersAsync();await expect(promise).resolves.toEqual({ok:true});expect(fetcher).toHaveBeenCalledTimes(2);expect(fetcher.mock.calls[0][1].redirect).toBe('error');vi.useRealTimers();
  });
});
