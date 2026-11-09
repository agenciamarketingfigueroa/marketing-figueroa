# Revisão da ferramenta e importação diária

## Interface vigente

O pedido mais recente substitui a ordem rígida do Prompt Mestre anterior. A ferramenta Gestor foi removida da navegação, da página e do código. Analytics concentra o relatório completo e o novo workspace **Ações do dia**. O Painel abre a mesma análise pelo botão existente.

- Removidos os blocos “Exportações e critérios” e “Diagnóstico executivo”. As regras continuam na camada interna.
- Mantidos indicadores financeiros, fechamento detalhado, funil, grupos e evolução histórica. Comparações têm verde para melhora e vermelho para piora. CPA/CPC/CPM menores são melhora; gasto isolado é neutro. Base zero ou incompleta não gera percentual inventado.
- Tracking tem seletor diário e inicia na maior data disponível nos exports.
- Ranking inicia em “Ativos no último dia do recorte”; permite ativos em qualquer dia do recorte, todos, inativos/pausados, sem entrega e status desconhecido. Métricas permanecem no intervalo selecionado. Atividade exige status explícito em linha diária.
- Leitura individual e plano usam somente os criativos ativos na última data disponível, com contexto de sete dias por ID. Os cards têm cabeçalho espaçado, métricas, decisão destacada e análise expandível.
- Ações do dia agrupa propostas de pausa, redução, aumento, revisão e acompanhamento. Não cria campanhas ou orçamentos ausentes. Grupos sem evidência mostram que não há ação sustentada. Aprovar registra a decisão localmente; não envia ações à Meta.
- Projeção visível é uma expectativa central apenas para o dia seguinte ao último fechamento, usando P50, ticket e gasto observado/premissa. A data fica explícita: com o último export em 07/11, o dia projetado é 08/11, mesmo quando o relatório é consultado em 09/11. Dia atual parcial não gera previsão rotulada como amanhã.
- No topo: **Resumo para WhatsApp** e **PDF para o cliente**. Ambos levam sete métricas essenciais e a mesma comparação breve. O PDF usa o logotipo existente, preto, laranja, cards e formato A4; salva pela impressão do navegador. O relatório interno extenso não é enviado. Destinatário e envio do WhatsApp são escolhidos pelo responsável.

## Importação executada

Fonte autorizada: pasta `relatórios` da área de trabalho, com 395 arquivos: **79 Hotmart, 79 Meta e 237 Instagram**. Datas internas: **21/08–07/11/2026**, sem lacunas nessas 79 datas. Nenhum arquivo de origem foi alterado. Cópias por SHA256 e snapshots ficam no diretório privado de dados.

- Hotmart: 803 linhas nos novos arquivos; base normalizada passou a 804 registros, preservando pendência anterior ausente no novo export. A ausência de uma linha não cancela nem apaga a transação.
- Meta: 3.383 linhas diárias, substituindo as versões das mesmas datas. Todas trazem impressões. IDs continuam arredondados. Status recebidos: active, inactive e not_delivering, preservados sem inferir ativação por gasto.
- Instagram: 237 registros de métricas, formando 79 dias com visualizações, interações e novos seguidores. Esses arquivos são UTF-16 e foram lidos com a codificação correta. Seguidores novos não viram saldo ou total de seguidores.
- Produtos adicionais de Violão, Baixo e Guia de Bolso foram cadastrados com vínculo obrigatório ao principal MVAVE comprovado. Packs confirmados vendidos como bump continuam adicionais, sem virar aquisição principal. Outras operações, moedas/países fora da política BRL/Brasil e vínculos ausentes ficam em revisão.
- Pacote operacional: 763 registros Hotmart de todos os status; 747 itens aprovados. 43 registros do lote normalizado estão fora do escopo ou em revisão. Registros de origem e versões anteriores permanecem disponíveis nos arquivos privados.

## Conferência financeira

No escopo MVAVE BR, 21/08–07/11: bruto **R$23.420,00**, líquido **R$18.986,78** e investimento atualizado **R$13.022,62**. Os novos exports Meta revisaram o gasto anterior em **R$11,95**. Não houve aumento de receita por duplicação de importação.

No export de 07/11: 54 linhas de anúncios, **8 ativos**, investimento **R$166,46**, bruto **R$204,40**, líquido **R$169,22**. A comparação financeira e a seleção de criativos sempre indicam as datas efetivamente usadas.

48 associações de imagens antigas foram preservadas por correspondência única do ID exportado e nome. 45 associações não tinham identidade correspondente segura nos novos registros e não foram reaplicadas por nome sozinho. As imagens e o pacote anterior continuam arquivados; não houve exclusão dos arquivos de mídia.

## Como continuar

Coloque novos exports nas subpastas Hotmart, Meta e Instagram. Nomes de arquivo ajudam a localizar, mas não definem a data de análise. A última data operacional é a maior data interna com mídia diária; importar agosto depois não faz as ações voltarem a agosto.

Da raiz do projeto:

```powershell
Read-Host 'Chave de dados existente' | & .\.tools\node-v22.23.4-win-x64\node.exe analise-mvave-br/scripts/importar-pasta.mjs 'C:\Users\Felipe\Desktop\relatórios' --dry-run
Read-Host 'Chave de dados existente' | & .\.tools\node-v22.23.4-win-x64\node.exe analise-mvave-br/scripts/importar-pasta.mjs 'C:\Users\Felipe\Desktop\relatórios'
```

A chave de dados é diferente da senha de login. Não gravar chave em argumentos, manifestos ou Git. A auditoria fica em `relatorios/consolidados/auditoria-pasta-diaria.json`; a prévia usa o sufixo `-previa`. O pacote criptografado precisa ser publicado pelo fluxo habitual do site. O comando não faz push nem deploy.

IDs textuais íntegros e nomes de campanha/conjunto ainda são necessários para conciliação individual confiável e recomendações específicas de orçamento. Os dados novos melhoram entrega, funil e comparações, mas não recuperam dígitos já arredondados no Excel.

Validação automatizada e renderização estrutural foram executadas. Inspeção visual em navegador/PDF depende do acesso ao navegador, indisponível nesta sessão; não confundir esses testes com uma inspeção visual concluída.
