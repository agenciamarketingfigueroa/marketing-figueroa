import 'server-only';
import { userDb } from './supabase';
import { configured } from './env';

export class AccessError extends Error {
  constructor(public status: number, public code: string) { super(code); }
}
export function accessDecision(userId: string | undefined, aal: string | undefined, membership: boolean) {
  if (!userId) return 'login';
  if (aal !== 'aal2') return 'mfa';
  return membership ? 'allowed' : 'forbidden';
}
export async function requireAccess(organizationId?: string) {
  if (!configured()) throw new AccessError(503,'NOT_CONFIGURED');
  const db = await userDb();
  const {data:user,error:userError} = await db.auth.getUser();
  if (userError || !user.user) throw new AccessError(401,'LOGIN_REQUIRED');
  const {data:claims,error:claimsError} = await db.auth.getClaims();
  if (claimsError || claims?.claims.aal !== 'aal2') throw new AccessError(403,'MFA_REQUIRED');
  let query = db.from('organization_members').select('organization_id,role').eq('user_id',user.user.id).order('organization_id');
  if (organizationId) query = query.eq('organization_id',organizationId);
  const {data:members,error} = await query.limit(1);
  if (error || !members?.length) throw new AccessError(403,'ACCESS_DENIED');
  return {db,organizationId:members[0].organization_id as string,role:members[0].role as string,userId:user.user.id};
}
