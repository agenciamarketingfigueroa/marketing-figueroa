import Link from 'next/link';
import { LoginForm } from '@/components/auth-forms';
import { configured } from '@/lib/server/env';
export const dynamic = 'force-dynamic';
export default function Login() {
  const demo = process.env.ENABLE_DEMO === 'true' || process.env.NODE_ENV === 'development';
  return <main className="auth-shell"><section className="auth-story"><span className="eyebrow">MARKETING FIGUEROA / ANALYTICS</span><h1>Os números.<br/>O contexto.<br/><em>A próxima decisão.</em></h1><p>Mídia e vendas em uma visão da sua operação.</p><div className="auth-caption">MVAVE BR <span>Inteligência de performance</span></div></section><section className="auth-card"><div className="brand-symbol">f<span>↗</span></div><span className="eyebrow">AMBIENTE PRIVADO</span><h2>Bom ter você aqui.</h2><p>Acesse com sua conta autorizada. A verificação em duas etapas protege os dados da operação.</p>{configured() ? <LoginForm/> : <div className="notice">O acesso privado aguarda a configuração do Supabase. Nenhuma conta está conectada.</div>}{demo && <Link className="button secondary full" href="/demo">Explorar demonstração <span>↗</span></Link>}<small>Não há cadastro público. Solicite acesso ao administrador.</small></section></main>;
}
