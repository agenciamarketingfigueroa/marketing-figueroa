import { redirect } from 'next/navigation';
import { userDb } from '@/lib/server/supabase';
import { configured } from '@/lib/server/env';
import { PasswordForm } from '@/components/auth-forms';
export const dynamic='force-dynamic';
export default async function SetupPassword() {
  if(!configured()) redirect('/login');
  const {data} = await (await userDb()).auth.getUser();if(!data.user) redirect('/login');
  return <main className="centered"><section className="auth-card"><h1>Defina seu acesso.</h1><p>Use uma senha exclusiva com pelo menos 12 caracteres.</p><PasswordForm/></section></main>;
}
