import { redirect } from 'next/navigation';
import { requireAccess, AccessError } from '@/lib/server/auth';
import { loadReport } from '@/lib/server/report';
import { dateInZone } from '@/lib/domain';
import { OPERATION_START } from '@/lib/operation';
import { Dashboard } from '@/components/dashboard';
export const dynamic = 'force-dynamic';
export default async function DashboardPage() {
  let access;
  try {
    access = await requireAccess();
  } catch(error) {
    if(error instanceof AccessError) {
      if(error.code==='MFA_REQUIRED') redirect('/mfa');
      if(error.code==='ACCESS_DENIED') return <main className="centered"><section className="auth-card"><h1>Acesso não autorizado.</h1><p>Sua conta ainda não pertence a uma organização. Solicite acesso ao administrador.</p><a className="button" href="/mfa">Gerenciar sessão</a></section></main>;
      redirect('/login');
    }
    throw error;
  }
  const end=dateInZone(new Date().toISOString());const start=OPERATION_START;
  return <Dashboard initialData={await loadReport(access,start,end)} initialStart={start} initialEnd={end}/>;
}
