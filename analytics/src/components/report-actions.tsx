import {useState} from 'react';
import type {Dataset,Filters} from '../lib/domain';
import {clientReport,reportHtml} from '../lib/client-report';
export function ClientReportActions({data,filters}:{data:Dataset;filters:Filters}){
  const [notice,setNotice]=useState('');
  function pdf(){const page=window.open('','_blank');if(!page){setNotice('Permita abrir a janela do relatório para salvar em PDF.');return;}page.opener=null;page.document.open();page.document.write(reportHtml(clientReport(data,filters)));page.document.close();page.focus();setTimeout(()=>page.print(),300);setNotice('Na impressão, selecione Salvar como PDF. O relatório usa o cliente e os filtros atuais.');}
  function whatsapp(){const report=clientReport(data,filters);window.open('https://wa.me/?text='+encodeURIComponent(report.text),'_blank','noopener,noreferrer');setNotice('Resumo preparado no WhatsApp. Escolha o destinatário e confirme o envio. Para anexar o PDF, salve-o e adicione-o à conversa.');}
  return <div className="client-export-actions"><div className="report-actions"><button className="button secondary" onClick={whatsapp}>Resumo para WhatsApp ↗</button><button className="button primary" onClick={pdf}>PDF para o cliente ↗</button></div>{notice&&<p role="status" className="filter-note">{notice}</p>}</div>;
}
