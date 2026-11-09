# Especificação anterior — referência histórica

**Atualização vigente:** veja [ATUALIZACAO_DIARIA_2026-11-09.md](ATUALIZACAO_DIARIA_2026-11-09.md). O usuário removeu o Gestor e o diagnóstico visível, pediu foco diário, resumo do cliente e projeção apenas do próximo dia. As regras de dados e segurança abaixo continuam válidas quando não conflitarem com essa revisão.

# Relatórios estratégicos do Analytics e Painel

Implementação de 08/11/2026 conforme `PROMPT_EVOLUCAO_RELATORIOS.md`. Mantidos componentes, cores, tipografia e navegação existentes. O Gestor permanece separado. Não há execução de campanhas ou integração de escrita com Meta/Hotmart.

## Como acessar

- **Analytics → MVAVE BR → Relatórios**: análise completa; PDF pela janela de impressão. O CSV e o resumo para WhatsApp existentes continuam disponíveis. O usuário escolhe o destinatário e confirma o envio.
- **Painel → MVAVE BR → Relatório estratégico**: abre a mesma análise; pausa a apresentação e permite voltar ao Painel.
- Selecione um dia, intervalo ou atalhos de 3/7/14/30 dias. Os indicadores comparam o período imediatamente anterior de igual duração. As projeções têm janela histórica própria, terminando no fechamento selecionado e excluindo o dia atual.

## Ordem e conteúdo

1. Diagnóstico executivo com fatos, interpretação, evolução, problema, destaque e recomendação.
2. KPIs financeiros e variações; principais e adicionais separados.
3. Fechamento diário, comparação dos últimos dois dias e consolidado.
4. Meta × Hotmart: eventos, valores, SCK exato, blended, pendências, reembolsos e limites de conciliação.
5. Funil, custos e taxas; Hotmart × Meta é taxa agregada, não coorte comprovada.
6. Ranking completo ordenável por gasto, principais SCK, CPA, ROAS, contribuição ou crescimento do gasto.
7. Narrativas individuais para os primeiros 80% do gasto, todos com compras diretas ou mudanças observadas de orçamento; restantes em grupo residual, sem pausa coletiva.
8. Grupos criativos pelos nomes; PERFORMANCE/LAB apenas com evidência de campanha. Nenhuma afirmação de incrementalidade.
9. Janelas reais de 3/7/14/30 dias e gráfico selecionável, sem conectar lacunas.
10. Propostas, aprovação e histórico separado de execução informada.
11. Projeções financeiras de 7/14/30 dias, sempre ao final.

## Regras financeiras e escopo

- Valores em centavos; moedas nunca somadas. Aprovado/Completo são receita confirmada no snapshot; pendentes e reembolsos ficam separados.
- Pedido principal único por referência principal; bump não é nova compra principal. Comprador único exige referência segura, indisponível no legado.
- Packs confirmados pelo cadastro MVAVE e adicionais com vínculo explícito ao principal. Produtos externos ou sem vínculo são excluídos da visualização, preservados no pacote original e discriminados no relatório.
- Em 21/08–07/11, foram separados **32 registros de todos os status**. Dentro do escopo MVAVE/BRL: bruto R$23.420,00, líquido R$18.986,78, mídia R$13.010,67 e contribuição R$5.976,11. Contribuição não é lucro final.
- Nenhum valor financeiro original foi reescrito nesta atualização: o pacote conserva 806 registros Hotmart e 4.690 linhas diárias Meta. A exclusão é uma seleção explícita de escopo para Analytics/Painel.
- Corrigida a leitura da união de intervalos adjacentes de cobertura. O histórico até 05/11 e os dias 06 e 07 agora formam um intervalo coberto; lacunas reais continuam indisponíveis. Isso resolve os totais vazios do print, sem transformar cobertura de datas em garantia de filtros completos.
- Em 06–07/11: 10 principais, 1 bump aprovado, 1 pendente; bruto R$353,90, líquido R$291,47 e mídia R$338,11. Nenhuma venda diretamente atribuída comprovada pelos IDs recebidos.

## Projeção reproduzível

Eficiência diária = pedidos principais / investimento. Conservador, Base e Otimista usam respectivamente P25, P50 e P75, com interpolação linear. Não são intervalos de confiança da soma futura. Dias constantes podem gerar cenários iguais.

Usa até 30 dias anteriores completos, com mídia positiva, receita e líquido disponíveis. Exige ao menos 7 dias e 7 principais; prioriza 14–30. Dias faltantes ficam listados. A premissa de mídia é informada pelo gestor ou a média de gasto dos últimos sete dias disponíveis. Não somamos orçamentos de conjunto repetidos por anúncio nem inferimos orçamento configurado de gasto.

Compras esperadas = mídia projetada × eficiência; bruto/líquido = compras × tickets ponderados observados. Compras esperadas podem ser fracionárias. Valores monetários arredondados a centavos. Alterar a premissa de investimento é uma simulação condicionada à mesma eficiência, sem promessa de escala.

Adicionais projetados separadamente por categoria apenas com ≥20 principais, ≥5 itens adicionais e presença em ≥3 dias. Categorias insuficientes permanecem indisponíveis e fora da receita futura projetada. Confiança é qualitativa, baixa ou moderada conforme amostra, lacunas, dispersão e premissa alterada; nunca equivale a uma probabilidade formal.

A meta inicial de R$10.000 é em BRL. Outros recortes monetários não recebem automaticamente a mesma meta. O indicador móvel conserva as vendas que permanecem e retira os dias que saem; ao final de 30 dias toda a janela atual terá saído. Os cenários mensais anteriores do Painel permanecem como simulações anteriores, distintos deste modelo estatístico.

## Aprovação e histórico

Propostas podem ser registradas e aprovadas no relatório. O registro fica criptografado no navegador, isolado por operação, e pode ser baixado. Não é uma base compartilhada entre dispositivos. Limpar o armazenamento local apaga a cópia local; mantenha o download para arquivo. Não há envio automático à Meta.

“Execução informada” exige proposta anterior e descrição de evidência/data pelo responsável; não é confirmação automática. Mudanças de orçamento visíveis nos exports aparecem separadamente na evidência diária do criativo. Só podem ser comprovadas nas datas em que existe orçamento explícito.

## Fontes, limites e próximas análises

Os exports atuais não permitem afirmar atribuição individual: IDs Meta arredondados, falta de impressões e nomes de campanha/conjunto, além de ausência de confirmação dos filtros de ativos/pausados. O legado anonimizado não permite recuperar SCK ou comprador individual. As propostas atuais priorizam revisão de tracking/estrutura; não há base para inventar orçamento sugerido ou declarar vencedores financeiros.

Para o próximo fechamento, importar Meta diário por anúncio com IDs textuais íntegros e Hotmart com todos os status, revisões e vínculo de adicionais, usando o fluxo do `README.md`. O importador mantém hashes, snapshots e substitui revisões sem duplicar. Reabrir Relatórios após a atualização/publicação recalcula períodos e cenários. A rotina local não faz push nem deploy.

Arquivos locais de conferência (ignorados pelo Git):

- `relatorios/consolidados/analise-estrategica-2026-11-06-a-07.html`: relatório completo pronto para imprimir.
- `relatorios/consolidados/auditoria-relatorio-estrategico.json`: conciliação de totais, escopo, cobertura e projeções.

Validação: testes unitários de finanças, projeções, escopo, arredondamento de IDs, duplicatas, lacunas, vendas tardias e histórico criptografado; conferência do pacote real e criptografia; typecheck e build manual. A verificação visual em navegador ainda precisa ser feita no ambiente de uso; a renderização estrutural não substitui essa inspeção.
