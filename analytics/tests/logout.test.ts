import { it,expect,vi } from 'vitest';
const mocks=vi.hoisted(()=>({signOut:vi.fn()}));
vi.mock('../src/lib/server/supabase',()=>({userDb:async()=>({auth:{signOut:mocks.signOut}})}));
vi.mock('next/navigation',()=>({redirect:(url:string)=>{throw new Error(`REDIRECT:${url}`);}}));
import { logout } from '../src/app/session-actions';
it('logout encerra sessão antes de redirecionar',async()=>{
  mocks.signOut.mockResolvedValue({error:null});await expect(logout()).rejects.toThrow('REDIRECT:/login');
  expect(mocks.signOut).toHaveBeenCalledWith({scope:'local'});
});
it('não apresenta logout como concluído quando revogação falha',async()=>{
  mocks.signOut.mockResolvedValue({error:new Error('provider failure')});
  await expect(logout()).rejects.toThrow('Não foi possível encerrar a sessão');
});
