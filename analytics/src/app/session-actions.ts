'use server';
import { redirect } from 'next/navigation';
import { userDb } from '@/lib/server/supabase';
export async function logout() {
  const db = await userDb();const {error} = await db.auth.signOut({scope:'local'});
  if(error) throw new Error('Não foi possível encerrar a sessão. Tente novamente.');
  redirect('/login');
}
