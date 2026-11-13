# Decisões e propostas

## 08/11/2026 — migração para central permanente

- Confirmado pelo responsável: análises MVAVE BR diárias; clientes de tráfego comum semanais.
- Nova cliente: aguardar reunião e implementação de 09/11 para criar perfil.
- Estratégia registrada: PERFORMANCE + LAB em ABO. Método Del suspenso.
- Proposta: completar IDs textuais, nomes de campanha/conjunto e cobertura de anúncios pausados antes de decidir escala individual.
- Nenhuma alteração de campanha, página de vendas ou configuração real foi executada.

## 08/11/2026 — evolução dos relatórios Analytics/Painel

- Implementadas as onze seções do novo Prompt Mestre, preservando o visual existente e mantendo Gestor separado.
- Corrigida a união de cobertura histórica; valores financeiros originais preservados. O escopo MVAVE exclui 32 registros externos/sem vínculo comprovado no período 21/08–07/11, sem removê-los do arquivo de origem.
- Projeções usam percentis da eficiência diária e premissas explícitas, com adicionais separados. Nenhuma garantia de escala ou recuperação.
- Proposta operacional: obter IDs íntegros e confirmar filtros/estrutura antes de decidir alterações individuais de orçamento. Não executada em campanhas.
- Aprovações no relatório são registros locais criptografados. Execução informada exige evidência e permanece distinta da observação em exports posteriores.


## 09/11/2026 — foco diário e retirada do Gestor

- Pedido explícito: remover ferramenta Gestor, diagnóstico visível e bloco Exportações e critérios. Regras passam a orientar internamente.
- Analytics concentra relatório e Ações do dia. Plano/leitura apenas dos ativos na última data; tracking diário; projeção somente do próximo dia; exports resumidos para cliente.
- Importados 395 arquivos de 79 dias das três fontes. IDs Meta ainda arredondados; nenhuma atribuição ou mudança de orçamento inventada.
- Reclassificação de adicionais exige vínculo ao principal confirmado. Originais e snapshots preservados; auditoria privada registra revisões. Nenhuma campanha alterada.

## 10/11/2026 — atualização local dos dias 08 e 09/11

- Importados os dez arquivos fornecidos: dois Hotmart, dois Meta e seis Instagram. Datas operacionais verificadas no conteúdo; última data disponível passou a 09/11/2026.
- Histórico até 07/11 preservado integralmente nas linhas do pacote; fontes, hashes, snapshots e auditoria privada mantidos. Reimportação conferida sem duplicação.
- CSV de seguidores de 09/11 contém somente o separador, sem data ou valor. Arquivado com aviso; seguidores permanecem indisponíveis, enquanto as outras métricas do dia foram importadas.
- Ajustada a importação para aceitar métricas Instagram parciais, sem transformar ausência em zero e sem substituir o histórico normalizado pelo lote novo.
- Atualizados a base local, relatórios e pacote criptografado. Nenhuma publicação remota ou alteração em campanhas foi executada.

### Confirmação posterior do responsável — seguidores de 09/11

- O responsável confirmou explicitamente que não houve novos seguidores em 09/11. Registrado valor **0** no Analytics/Painel, com fonte de confirmação manual, hash, snapshot e auditoria privados.
- A confirmação substitui a indisponibilidade registrada acima. O CSV vazio foi preservado; a regra geral continua sendo não inferir zero de arquivos vazios. Demais dados permanecem inalterados.

## 11/11/2026 — atualização de 10/11 e correção dos seguidores de 09/11

- Importados os cinco arquivos fornecidos, com datas conferidas no conteúdo: Hotmart e Meta de 10/11, visualizações e interações de 10/11 e seguidores de 09/11. Última data operacional: 10/11/2026.
- Seguidores novos de 09/11 corrigidos de **0 para 65** conforme o CSV recebido. A nova evidência substitui a confirmação manual anterior, preservada junto ao export vazio, hashes, snapshots e auditoria privada.
- Seguidores de 10/11 permanecem indisponíveis por falta de export, sem preenchimento com zero.
- Uma venda do Guia de Bolso do Timbre permanece REVISAR por falta de vínculo comprovado ao principal exigido pela configuração. Não incorporada aos totais MVAVE BR.
- Histórico financeiro até 09/11 e Instagram anterior à correção preservados. Reimportação verificada sem duplicação; base, relatórios locais e pacote criptografado atualizados. Nenhuma campanha ou publicação remota foi alterada.

### Correção solicitada pelo responsável — duas vendas em 10/11

- O responsável confirmou **2 vendas em 10/11**, substituindo a pendência de classificação acima. O export Hotmart já continha o Pack de Violão (R$29,90 bruto / R$24,45 líquido) e o Guia de Bolso do Timbre (R$37,00 bruto / R$30,85 líquido), ambos aprovados.
- O Guia foi reconhecido como venda avulsa nesta data. A exceção `standaloneSaleDates` no cadastro vale somente para 10/11; bumps e upgrades continuam separados, e os demais dias não são reclassificados.
- Revisão: **1 → 2 pedidos principais**, **R$29,90 → R$66,90 bruto**, **R$24,45 → R$55,30 líquido**; contribuição após R$122,49 de mídia: **−R$67,19**. São dois pedidos e um comprador único identificado na fonte.
- Preservados os valores e hashes originais, histórico anterior, mídia e Instagram. Confirmação, classificação antes/depois e cópias da base/pacote arquivadas em `dados/`. Reimportação sem duplicação. Pacote criptografado e relatórios locais atualizados; nenhuma publicação remota executada.

## 12/11/2026 — atualização de 11/11 e seguidores de 10/11

- Importados os seis arquivos fornecidos, com datas verificadas no conteúdo: Hotmart e Meta de 11/11, três métricas Instagram de 11/11 e seguidores de 10/11. Última data operacional: 11/11/2026.
- Seguidores novos de 10/11: **indisponível → 62**, conforme CSV; não se trata do total de seguidores. Preservados os 65 de 09/11 e as duas vendas confirmadas de 10/11. Em 11/11: 39 novos seguidores, 5.901 visualizações e 18 interações.
- Hotmart de 11/11: quatro pedidos principais aprovados, R$119,60 bruto e R$97,80 líquido. Mídia de R$92,09; contribuição após mídia de R$5,71, não lucro final.
- O novo Meta não contém IDs de anúncios, compras, valor de conversão, cliques, LPV ou checkouts. Preservados gasto, impressões, conjuntos e status explícitos; não foi inferida atribuição por nome. Métricas ausentes permanecem indisponíveis. Corrigido o resumo agregado interno para não converter compras Meta ausentes em zero.
- Históricos financeiro e de mídia até 10/11 preservados; somente a métrica de seguidores solicitada foi completada nessa data. Originais, hashes, snapshots e auditoria antes/depois arquivados em `dados/`. Reimportação e integridade do pacote verificadas sem duplicação.
- Atualizados a base, relatórios locais e pacote criptografado. Nenhuma campanha ou publicação remota foi alterada.

### Reexport posterior de 11/11 — complemento filtrado

- O responsável informou filtro de anúncios ativos. Novo arquivo contém seis anúncios, R$81,47 de mídia, três compras Meta, R$73,35 de valor de conversão, 142 cliques, 112 LPVs e 12 checkouts. ROAS do recorte: 0,90x; CPA Meta: R$27,16. IDs continuam arredondados e não há coluna de impressões.
- O primeiro export conserva 52 linhas, R$92,09 de gasto e 10.023 impressões. O recorte novo deixa R$10,62 fora; não substitui o fechamento nem é somado à mídia anterior. Nenhum vínculo por nome ou ID exato foi inventado entre as versões.
- Importado como complemento independente em `metaSupplements` na base e `manualMetaSupplementalExports` no pacote criptografado. Painel/Mídia paga e tracking do relatório exibem cobertura parcial e tabela do recorte; os totais gerais incompletos continuam indisponíveis.
- Hotmart, Instagram, mídia anterior, datas operacionais e períodos preservados integralmente. Original, SHA256, snapshots e auditoria privados; reimportação sem duplicação. Relatórios locais regenerados. Pendências manuais passam a ser preservadas pelo gerador.
- Para completar os totais do dia: exportar todos os anúncios, incluindo inativos/sem entrega, com compras, valor de conversão, funil, impressões e IDs textuais íntegros. Nenhuma publicação remota executada.

### Reexport completo recebido em 12/11 — métricas de 11/11 resolvidas

- Novo export de 11/11 contém 52 anúncios: sete ativos, cinco inativos e 40 sem entrega. Conferidos R$92,09 e 10.023 impressões contra o primeiro arquivo, sem perda nem duplicação de mídia. Compras, valor de conversão e funil agora disponíveis em todas as linhas.
- Dia 11/11: três compras Meta, R$73,35 de valor de conversão reportado, ROAS Meta 0,80x, CPA Meta R$30,70, 163 cliques, 128 LPVs e 13 checkouts. Hotmart permanece com quatro principais, R$119,60 bruto e R$97,80 líquido; não forçada igualdade entre fontes.
- Período de 21/08 a 11/11: mídia R$13.501,66, 679 compras Meta, ROAS Meta 1,37x e CPA Meta R$19,88. Valores verificados pela mesma função do Painel e pela renderização estrutural dos cards com o pacote real.
- O complemento filtrado anterior foi marcado como substituído pelo SHA256 do novo export; permanece no histórico e nos snapshots, mas o aviso parcial deixa de aparecer. Histórico financeiro, mídia anterior a 11/11 e Instagram preservados, incluindo 62 novos seguidores de 10/11. Reimportação sem duplicação.
- IDs ainda arredondados: atribuição SCK exata continua indisponível. Atualizados relatórios locais, pacote criptografado e build manual; testes Node, Analytics e typecheck aprovados. Nenhuma publicação remota executada.
