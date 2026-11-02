import { describe,it,expect,vi,beforeEach } from 'vitest';
const mocks=vi.hoisted(()=>({userDb:vi.fn(),workerDb:vi.fn()}));
vi.mock('../src/lib/server/supabase',()=>mocks);
import { accessDecision,requireAccess } from '../src/lib/server/auth';
import { POST as webhookPost } from '../src/app/api/webhooks/hotmart/route';
import { POST as cronPost } from '../src/app/api/cron/sync/route';
import { GET as creativeGet } from '../src/app/api/creative-image/route';
import { NextRequest } from 'next/server';
beforeEach(()=>{vi.resetAllMocks();vi.stubEnv('NEXT_PUBLIC_SUPABASE_URL','https://example.supabase.co');vi.stubEnv('NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY','public-test');vi.stubEnv('HOTMART_HOTTOK','test-hottok');vi.stubEnv('CRON_SECRET','c'.repeat(32));});
describe('Fronteiras de acesso HTTP e sessão',()=>{
  it('exige login, MFA e vínculo com a organização',()=>{
    expect(accessDecision(undefined,undefined,false)).toBe('login');
    expect(accessDecision('user','aal1',true)).toBe('mfa');
    expect(accessDecision('user','aal2',false)).toBe('forbidden');
    expect(accessDecision('user','aal2',true)).toBe('allowed');
  });
  it('valida usuário no servidor e bloqueia sessão ausente',async()=>{
    mocks.userDb.mockResolvedValue({auth:{getUser:vi.fn().mockResolvedValue({data:{user:null},error:null})}});
    await expect(requireAccess()).rejects.toMatchObject({status:401});
  });
  it('bloqueia admin sem AAL2 antes de consultar dados',async()=>{
    mocks.userDb.mockResolvedValue({auth:{getUser:vi.fn().mockResolvedValue({data:{user:{id:'user'}},error:null}),getClaims:vi.fn().mockResolvedValue({data:{claims:{aal:'aal1'}},error:null})}});
    await expect(requireAccess()).rejects.toMatchObject({code:'MFA_REQUIRED'});expect(mocks.workerDb).not.toHaveBeenCalled();
  });
  it('rejeita webhook sem Hottok sem ler corpo nem banco',async()=>{
    const response=await webhookPost(new Request('https://app.test/api/webhooks/hotmart',{method:'POST',body:'invalid'}));
    expect(response.status).toBe(401);expect(mocks.workerDb).not.toHaveBeenCalled();
  });
  it('rejeita cron sem segredo válido',async()=>{
    const response=await cronPost(new NextRequest('https://app.test/api/cron/sync?provider=meta',{method:'POST'}));
    expect(response.status).toBe(401);expect(mocks.workerDb).not.toHaveBeenCalled();
  });
  it('rejeita imagem privada e cron Instagram sem autorização',async()=>{
    mocks.userDb.mockResolvedValue({auth:{getUser:vi.fn().mockResolvedValue({data:{user:null},error:null})}});
    expect((await creativeGet(new NextRequest('https://app.test/api/creative-image?account=1&ad=2'))).status).toBe(401);
    expect((await cronPost(new NextRequest('https://app.test/api/cron/sync?provider=instagram',{method:'POST'}))).status).toBe(401);
    expect(mocks.workerDb).not.toHaveBeenCalled();
  });
  it('retorna 429 antes de processar webhook quando limite foi atingido',async()=>{
    vi.stubEnv('SYNC_ORGANIZATION_ID','11111111-1111-4111-8111-111111111111');vi.stubEnv('HOTMART_ACCOUNT_ID','hm');
    const rpc=vi.fn().mockResolvedValue({data:false,error:null});mocks.workerDb.mockReturnValue({rpc});
    const response=await webhookPost(new Request('https://app.test/api/webhooks/hotmart',{method:'POST',headers:{'X-HOTMART-HOTTOK':'test-hottok','Content-Type':'application/json'},body:'{}'}));
    expect(response.status).toBe(429);expect(rpc).toHaveBeenCalledTimes(1);
  });
});
