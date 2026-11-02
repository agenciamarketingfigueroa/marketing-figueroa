'use client';
import { useState, type FormEvent } from 'react';
import { browserDb } from '@/lib/supabase-browser';
import { useRouter } from 'next/navigation';
import Image from 'next/image';

export function LoginForm() {
  const router=useRouter();
  const [error,setError] = useState(''); const [busy,setBusy] = useState(false);
  async function submit(e:FormEvent<HTMLFormElement>) {
    e.preventDefault(); setBusy(true); setError('');
    const form = new FormData(e.currentTarget);
    try {
      const {error} = await browserDb().auth.signInWithPassword({email:String(form.get('email')),password:String(form.get('password'))});
      if (error) {setError('Não foi possível entrar. Confira seus dados ou tente novamente em instantes.');return;}
      router.replace('/mfa');router.refresh();
    } catch {setError('Não foi possível conectar ao serviço de acesso.');} finally {setBusy(false);}
  }
  return <form onSubmit={submit} className="auth-form"><label>E-mail<input name="email" type="email" autoComplete="username" required/></label><label>Senha<input name="password" type="password" autoComplete="current-password" required minLength={8}/></label>{error && <p role="alert" className="error-text">{error}</p>}<button className="button primary full" disabled={busy}>{busy ? 'Entrando…' : 'Entrar com segurança →'}</button></form>;
}
export function MfaForm() {
  const router=useRouter();
  const [factor,setFactor] = useState(''); const [qr,setQr] = useState(''); const [error,setError] = useState(''); const [busy,setBusy] = useState(false);
  async function prepare() {
    setBusy(true);setError('');
    try {
      const db = browserDb();
      const {data,error} = await db.auth.mfa.listFactors(); if(error) throw error;
      const verified = data.totp.find(f => f.status === 'verified');
      if(verified) {setFactor(verified.id);return;}
      // Clean only abandoned, unverified factors belonging to the current session.
      for(const f of data.all.filter(f => f.factor_type === 'totp' && f.status === 'unverified')) await db.auth.mfa.unenroll({factorId:f.id});
      const result = await db.auth.mfa.enroll({factorType:'totp',friendlyName:'Figueroa Analytics'});
      if(result.error) throw result.error;
      setFactor(result.data.id);setQr(result.data.totp.qr_code);
    } catch {setError('Não foi possível preparar a verificação. Entre novamente.');} finally {setBusy(false);}
  }
  async function verify(e:FormEvent<HTMLFormElement>) {
    e.preventDefault();setBusy(true);setError('');
    const code = String(new FormData(e.currentTarget).get('code'));
    try {
      const {error} = await browserDb().auth.mfa.challengeAndVerify({factorId:factor,code});
      if(error) {setError('Código inválido ou expirado. Tente o próximo código.');return;}
      router.replace('/dashboard');router.refresh();
    } catch {setError('Falha de conexão. Tente novamente.');} finally {setBusy(false);}
  }
  return <>{!factor ? <button className="button primary full" disabled={busy} onClick={prepare}>{busy ? 'Preparando…' : 'Verificar com autenticador'}</button> : <form onSubmit={verify} className="auth-form">{qr && <><p>Adicione esta conta no seu aplicativo autenticador e confirme o código.</p><Image unoptimized width={220} height={220} className="qr" src={qr} alt="QR code para configurar o autenticador TOTP"/></>}<label>Código de 6 dígitos<input name="code" inputMode="numeric" pattern="[0-9]{6}" maxLength={6} autoComplete="one-time-code" required/></label><button disabled={busy} className="button primary full">{busy ? 'Validando…' : 'Confirmar e acessar →'}</button></form>}{error && <p role="alert" className="error-text">{error}</p>}</>;
}
export function PasswordForm() {
  const router=useRouter();
  const [message,setMessage] = useState(''); const [busy,setBusy] = useState(false);
  async function submit(e:FormEvent<HTMLFormElement>) {
    e.preventDefault();setBusy(true);
    const values = new FormData(e.currentTarget);const password = String(values.get('password'));
    if(password !== values.get('confirm')) {setMessage('As senhas precisam ser iguais.');setBusy(false);return;}
    try {const {error} = await browserDb().auth.updateUser({password});if(error) setMessage('Não foi possível definir a senha. Solicite um novo convite.');else {router.replace('/mfa');router.refresh();}}
    catch {setMessage('Falha de conexão. Tente novamente.');} finally {setBusy(false);}
  }
  return <form onSubmit={submit} className="auth-form"><label>Nova senha<input name="password" type="password" minLength={12} autoComplete="new-password" required/></label><label>Repita a senha<input name="confirm" type="password" minLength={12} autoComplete="new-password" required/></label><button disabled={busy} className="button primary">Definir senha</button>{message && <p role="alert">{message}</p>}</form>;
}
