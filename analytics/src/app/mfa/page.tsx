import { redirect } from 'next/navigation';
import { userDb } from '@/lib/server/supabase';
import { configured } from '@/lib/server/env';
import { MfaForm } from '@/components/auth-forms';
import { logout } from '@/app/session-actions';
export const dynamic='force-dynamic';
export default async function Mfa() {
  if(!configured()) redirect('/login');
  const db = await userDb();const {data} = await db.auth.getUser();if(!data.user) redirect('/login');
  return <main className="centered"><section className="auth-card"><span className="eyebrow">SEGUNDA ETAPA</span><h1>Confirme que é você.</h1><p>Use seu aplicativo autenticador. Nenhum dado financeiro é liberado antes da verificação.</p><MfaForm/><form action={logout}><button className="text-button">Sair desta conta</button></form></section></main>;
}
