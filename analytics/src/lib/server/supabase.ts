import 'server-only';
import { createServerClient } from '@supabase/ssr';
import { createClient } from '@supabase/supabase-js';
import { cookies } from 'next/headers';
import { required } from './env';

export async function userDb() {
  const store = await cookies();
  return createServerClient(required('NEXT_PUBLIC_SUPABASE_URL'), required('NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY'), {
    cookies: { getAll: () => store.getAll(), setAll(values) {
      try { values.forEach(({ name, value, options }) => store.set(name, value, options)); }
      catch { /* Server Components cannot write; proxy handles refresh. */ }
    } },
  });
}
/** Service role is only used by authenticated provider/cron routes, never dashboard readers. */
export function workerDb() {
  return createClient(required('NEXT_PUBLIC_SUPABASE_URL'), required('SUPABASE_SERVICE_ROLE_KEY'), {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}
