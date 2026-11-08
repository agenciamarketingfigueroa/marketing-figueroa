# Auditoria de implantação · 08/11/2026

O projeto possui um site estático, páginas de cliente/Área Interna, um Analytics React compilado para uso manual e um Painel que usa o mesmo login e envelope AES-GCM. A aplicação Next/Supabase existe separadamente; integrações reais não foram ativadas. O diretório de trabalho começou sem mudanças no Git e sem AGENTS.md.

Foram aproveitados os componentes existentes e a criptografia, sem criar hospedagem paralela. O importador anterior exigia totais históricos iguais e recusava correções; foi mantido para compatibilidade. O novo importador especializado mantém uma base por transação/item e snapshots, fazendo a ponte para o mesmo dataset do site. O histórico anterior foi comparado registro a registro após a atualização.

Identificadores Meta estavam em notação científica e a mídia não inclui campanhas/conjuntos ou impressões. A Hotmart inclui país/moeda, produtos, vínculos de bump, SCK e status. Os produtos cadastrados foram confirmados pelos IDs e nomes dos arquivos recebidos; outros produtos continuam em revisão. Os dois XLS históricos de Victor Lopes encontrados no repositório foram excluídos do escopo MVAVE.

Escopo de alterações: Gestor, seletores de cliente, exportação/compartilhamento de relatórios, importador local, documentação e regras persistentes. Nenhuma página de venda, campanha, conta Meta/Hotmart, credencial, integração real ou agendamento foi alterado.

Verificação visual: o host de acesso a abas não estava disponível. A alternativa de controle do Chrome foi interrompida pela ferramenta porque não conseguiu determinar a URL atual com segurança. A interface deve ser conferida no navegador pelo responsável; testes, TypeScript, build e verificações HTTP foram realizados separadamente.
