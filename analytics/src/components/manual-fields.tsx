'use client';
import {useState} from 'react';
import type {Dataset,FollowerSnapshot} from '@/lib/domain';

export interface ManualActions {
  save:(followers:FollowerSnapshot[])=>Promise<void>;
  download:()=>Promise<void>;
  restore:(file:File)=>Promise<FollowerSnapshot[]>;
}
export function ManualFields({data,actions,onChange}:{data:Dataset;actions:ManualActions;onChange:(followers:FollowerSnapshot[])=>void}) {
  const [message,setMessage]=useState('');const [busy,setBusy]=useState(false);
  async function persist(followers:FollowerSnapshot[]) {
    await actions.save(followers);onChange(followers);
  }
  async function submit(event:React.FormEvent<HTMLFormElement>) {
    event.preventDefault();const form=event.currentTarget;const fields=new FormData(form);
    const username=String(fields.get('username')).trim().replace(/^@/,'').toLowerCase();
    const date=String(fields.get('date')),followers=Number(fields.get('followers'));
    if(!/^[a-z0-9._]{1,30}$/.test(username)||!/^\d{4}-\d{2}-\d{2}$/.test(date)||!Number.isSafeInteger(followers)||followers<0) {setMessage('Confira o perfil, a data e a quantidade inteira de seguidores.');return;}
    setBusy(true);
    try {await persist([...(data.followers??[]).filter(s=>!(s.username===username&&s.date===date)),{accountId:'manual-instagram-'+username,username,date,followers,observedAt:new Date().toISOString()}].sort((a,b)=>a.date.localeCompare(b.date)));setMessage('Registro salvo neste navegador. Selecione o período da data informada para vê-lo no gráfico. Baixe a cópia para levar a outra máquina.');}
    catch {setMessage('Não foi possível salvar. Tente novamente.');}finally {setBusy(false);}
  }
  return <section className="panel manual-fields"><div className="panel-heading"><div><h2>Seus registros de seguidores</h2><p>Informe a contagem observada e a data. O gráfico usa apenas esses registros.</p></div></div>
    <form className="manual-form" onSubmit={submit}><label>Perfil do Instagram<input name="username" placeholder="@perfil" defaultValue={data.followers?.at(-1)?.username??''} required maxLength={31}/></label><label>Data do registro<input name="date" type="date" required/></label><label>Quantidade de seguidores<input name="followers" type="number" min="0" step="1" required/></label><button className="button primary" disabled={busy}>Salvar registro</button></form>
    <p className="filter-note">Um registro com o mesmo perfil e data substitui o anterior. Os dados são salvos criptografados neste navegador; publicar o site não envia esses registros automaticamente.</p>
    <div className="manual-actions"><button className="button secondary" disabled={busy} onClick={async()=>{try{await actions.download();setMessage('Cópia criptografada baixada. Ela pode ser restaurada após entrar com sua senha.');}catch{setMessage('Não foi possível baixar a cópia.');}}}>Baixar registros</button><label className="button secondary">Restaurar registros<input aria-label="Restaurar registros" type="file" accept=".json" disabled={busy} onChange={async e=>{const file=e.target.files?.[0];if(!file)return;setBusy(true);try{const followers=await actions.restore(file);await persist(followers);setMessage('Registros restaurados neste navegador.');}catch{setMessage('Arquivo inválido ou vinculado a outro acesso.');}finally{setBusy(false);e.target.value='';}}}/></label></div>
    <p role="status">{message}</p>
    {(data.followers??[]).length>0&&<div className="table-scroll"><table><thead><tr><th>Perfil</th><th>Data</th><th>Seguidores</th><th/></tr></thead><tbody>{data.followers?.map(s=><tr key={s.accountId+s.date}><td>@{s.username}</td><td>{s.date.split('-').reverse().join('/')}</td><td>{s.followers.toLocaleString('pt-BR')}</td><td><button className="text-button" disabled={busy} onClick={async()=>{setBusy(true);try{await persist(data.followers!.filter(row=>row!==s));setMessage('Registro removido.');}catch{setMessage('Não foi possível remover.');}finally{setBusy(false);}}}>Remover</button></td></tr>)}</tbody></table></div>}
  </section>;
}
