import 'server-only';
import { z } from 'zod';

export function required(name: string): string {
  const value = process.env[name];
  if (!value) throw new Error('NOT_CONFIGURED');
  return value;
}
export function syncScope() {
  return { organizationId: z.uuid().parse(required('SYNC_ORGANIZATION_ID')), hotmartAccount: required('HOTMART_ACCOUNT_ID') };
}
export function configured() {
  return Boolean(process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY);
}
