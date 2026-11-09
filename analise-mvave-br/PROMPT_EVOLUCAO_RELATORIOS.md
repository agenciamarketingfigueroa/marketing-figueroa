# PROMPT MESTRE — EVOLUÇÃO DOS RELATÓRIOS MVAVE BR

## 1. Objetivo

Quero aprimorar profundamente o módulo de **Relatórios e Análises Estratégicas** da ferramenta de Painel e Analytics MVAVE BR.

**IMPORTANTE: A IDENTIDADE VISUAL ATUAL ESTÁ APROVADA.**

Não quero um redesign. Preserve integralmente o design system existente, incluindo cores, tipografia, componentes, cards, gráficos, espaçamentos, navegação, responsividade e padrões de interação.

O objetivo é melhorar a **profundidade analítica, organização das informações, interpretação dos dados, recomendações operacionais e projeções financeiras**.

A ferramenta deve funcionar como um analista estratégico de tráfego pago, e não apenas como um visualizador de métricas.

Use como referência o relatório de 6 e 7 de novembro de 2026 que estou fornecendo, mas considere as diretrizes abaixo como especificação da nova estrutura.

---

## 2. Princípios inegociáveis

1. **Hotmart é a verdade financeira.** Ela determina compras confirmadas, produtos vendidos, receitas brutas e líquidas, adicionais, reembolsos e demais transações.
2. **Meta Ads é a verdade da mídia.** Ela determina investimento, entrega, impressões, cliques, CPC, CPM, CTR, LPVs, checkouts e eventos atribuídos pela plataforma.
3. **SCK é a referência de atribuição direta.** Relacione o SCK da compra ao ID do anúncio. Vendas sem correspondência confiável permanecem blended/não atribuídas.
4. Nunca invente números, vendas, atribuições, orçamentos ou alterações de campanha.
5. Compras principais, order bumps, upsells e upgrades precisam ser contabilizados separadamente.
6. Um order bump não representa um novo comprador.
7. Não misture MVAVE BR com outras operações ou moedas.
8. Diferencie o que é fato comprovado, interpretação analítica, hipótese e recomendação.
9. Não confunda recomendação anterior com alteração realmente executada no Meta.
10. Preserve a estratégia vigente: **PERFORMANCE + LAB, com ABO e um criativo por conjunto como estrutura preferencial. O Método Del está suspenso.**
11. Não execute alterações nas campanhas automaticamente. As decisões devem ser apresentadas para aprovação.
12. As análises devem considerar histórico, evolução e contexto, sem reagir exageradamente a um único fechamento.

Se uma informação estiver ausente ou inconsistente, informe a limitação. Não preencha lacunas com suposições.

---

# 3. ORDEM OBRIGATÓRIA DOS RELATÓRIOS

Esta ordem deve ser seguida em todas as análises.

## SEÇÃO 1 — Diagnóstico executivo

Comece cada relatório apresentando:

- Nome da operação e período analisado.
- Status do fechamento: completo, parcial ou atualizado.
- Diagnóstico financeiro do período.
- Principal evolução positiva.
- Principal problema identificado.
- Criativo de maior destaque.
- Decisão estratégica mais importante.

O texto deve ser interpretativo e objetivo.

Exemplo de abordagem:

"A operação terminou positiva, mas perdeu eficiência em relação ao período anterior. Enquanto o criativo X manteve compras recorrentes, os anúncios de remarketing consumiram uma parcela importante da verba sem gerar vendas diretamente comprovadas."

Não escreva apenas que o ROAS subiu ou caiu. Explique o significado operacional.

## SEÇÃO 2 — Indicadores financeiros principais

Utilize os cards de indicadores já existentes no painel para apresentar:

- Investimento em mídia.
- Compras principais.
- Faturamento bruto do front-end.
- Receita líquida do front-end.
- CPA real.
- ROAS bruto.
- Relação receita líquida/investimento.
- Contribuição após mídia.
- Ticket médio bruto e líquido.
- Order bumps e receita adicional.
- Cobertura de atribuição por SCK.

Mostre também as variações percentuais em relação ao período comparável anterior.

**Fórmulas:**

CPA real = investimento Meta / compras principais confirmadas.

ROAS bruto = faturamento bruto / investimento Meta.

Líquido/mídia = receita líquida / investimento Meta.

Contribuição = receita líquida - investimento Meta.

A contribuição não deve ser chamada de lucro líquido da empresa, porque não inclui todos os custos operacionais.

## SEÇÃO 3 — Fechamento financeiro detalhado

Apresente uma tabela comparativa por dia, quando houver mais de um dia disponível.

Colunas recomendadas:

| Indicador | Dia anterior | Dia atual | Variação |
|---|---|---|---|
| Investimento | | | |
| Compras principais | | | |
| Receita bruta | | | |
| Receita líquida | | | |
| CPA | | | |
| ROAS bruto | | | |
| Líquido/mídia | | | |
| Contribuição | | | |

Mantenha indicadores de front-end separados dos adicionais.

Inclua também um consolidado financeiro com os adicionais, quando existirem.

Depois da tabela, explique o comportamento financeiro observado.

## SEÇÃO 4 — Tracking e conciliação Meta × Hotmart

Apresente o resultado das duas plataformas lado a lado.

Inclua:

- Purchases Meta.
- Compras principais Hotmart.
- Compras com SCK identificado.
- Compras blended.
- Diferença de eventos.
- Diferença de valores de conversão.
- Order bumps contabilizados no Meta.
- Conversões posteriores ou ausentes no relatório Meta.
- Possíveis duplicidades.

A análise deve identificar quando o Meta registra uma Purchase que não possui confirmação individual pela Hotmart.

**Não atribua vendas sem SCK para completar artificialmente os números de algum anúncio.**

Preserve os IDs dos anúncios como texto, sem arredondamento dos dígitos.

Se o arquivo do Meta estiver em nível de campanha ou conjunto, não invente gasto individual de anúncios. Informe o nível de granularidade disponível.

## SEÇÃO 5 — Análise do funil

Apresente um funil completo com:

**Impressões → Cliques → LPVs → Checkouts → Compras.**

Calcule, quando os dados estiverem disponíveis:

- CTR.
- CPC.
- CPM.
- Connect Rate.
- LPV → Checkout.
- Checkout → Compra.
- LPV → Compra.

Exiba gráficos e indicadores comparativos usando os componentes existentes do painel.

Explique em qual etapa ocorreu a principal variação.

Evite afirmar causalidade sem evidência. Métricas que combinam checkouts Meta com compras Hotmart devem ser identificadas como taxas agregadas, não conversão comprovada de uma mesma coorte.

## SEÇÃO 6 — Ranking completo dos criativos

Esta é uma das seções mais importantes.

Monte uma tabela comparativa dos anúncios com colunas para:

| Criativo | Mídia | Compras SCK | CPA direto | Bruto direto | ROAS bruto | Contribuição direta | Decisão |
|---|---|---|---|---|---|---|---|

Permita ordenar por gasto, compras, CPA, ROAS, contribuição e crescimento.

Agrupe, quando aplicável, os criativos em:

- Tradicionais.
- Sorteio mensal — público frio.
- Sorteio mensal — remarketing.
- LAB.
- PERFORMANCE.

Evite avaliar os anúncios somente pelo ROAS. Considere também volume, gasto acumulado, recorrência de compras, contribuição e capacidade de absorção de orçamento.

Um criativo com uma venda e R$2 de investimento não deve ser automaticamente considerado superior a outro que sustenta dez vendas com boa margem.

## SEÇÃO 7 — Leitura individual dos criativos

**Não pule esta seção. Não a substitua por uma tabela resumida.**

Cada criativo relevante deve receber uma análise individual, especialmente aqueles que concentram investimento, apresentam mudanças importantes ou precisam de decisão operacional.

Para cada criativo, apresente:

**Identificação e situação**

Nome, instrumento, campanha, conjunto, grupo estratégico, orçamento atual conhecido e status de entrega, quando disponíveis.

**Resultado financeiro**

Investimento, compras diretamente confirmadas, faturamento bruto e líquido, CPA, ROAS e contribuição.

**Evolução temporal**

Compare o desempenho entre dias e na janela acumulada.

Explique se houve regularidade, melhora, deterioração, concentração de vendas ou conversões posteriores.

**Leitura de comportamento**

Comente cliques, visitas, checkouts, compras, entrega e eventuais mudanças no orçamento.

**Interpretação estratégica**

Explique o que os dados sugerem, quais são as hipóteses plausíveis e quais conclusões não podem ser afirmadas.

**Decisão**

Classifique como:

- Manter.
- Manter sob observação.
- Continuar teste na LAB.
- Reduzir orçamento.
- Aumentar orçamento.
- Pausar.
- Candidato à PERFORMANCE.
- Revisar tracking/estrutura.

A decisão precisa conter justificativa e, quando aplicável, novo orçamento sugerido.

Não use classificações automáticas sem considerar o contexto.

Para os anúncios com gasto residual e sem necessidade de decisão individual, utilize um agrupamento resumido, deixando explícitos os critérios.

## SEÇÃO 8 — Análise estratégica por grupo

Compare o desempenho agregado de:

**Tradicionais × Sorteio público frio × Sorteio remarketing.**

Quando a estrutura estiver disponível, compare também PERFORMANCE × LAB.

Apresente investimento, compradores diretamente atribuídos, CPA, ROAS direto e contribuição.

Analise se os novos criativos estão agregando capacidade de aquisição ou apenas substituindo resultados dos anúncios anteriores.

Não afirme incrementalidade sem um experimento que sustente essa conclusão.

## SEÇÃO 9 — Análise de evolução histórica

Mostre gráficos para janelas disponíveis de:

**3, 7, 14 e 30 dias.**

Indicadores prioritários:

- Compras diárias.
- Investimento diário.
- Receita bruta e líquida.
- ROAS bruto.
- CPA.
- Contribuição após mídia.

Destaque tendências, oscilações, mudanças de orçamento, novos criativos e dias atípicos.

As janelas devem ser calculadas sobre dados realmente disponíveis. Se faltar algum dia, avise e não apresente a série incompleta como se fosse contínua.

Sempre que houver uma venda atrasada ou relatório atualizado, recalcule os fechamentos envolvidos e identifique a revisão.

## SEÇÃO 10 — Plano de ação operacional

Apresente uma tabela objetiva:

| Criativo | Orçamento atual | Orçamento sugerido | Decisão | Justificativa |
|---|---|---|---|---|

Depois da tabela, explique os principais movimentos recomendados.

Priorize:

- Preservar compradores recorrentes.
- Identificar desperdício acumulado.
- Evitar duplicidade de criativos em diferentes campanhas.
- Não aumentar muitos orçamentos simultaneamente.
- Preservar a capacidade de aquisição.
- Continuar alimentando a LAB.
- Promover criativos consistentes à PERFORMANCE.
- Evitar que sucessivas pausas encolham permanentemente o investimento.

**Nunca trate a recomendação como alteração executada.**

Registre em histórico o que foi sugerido. Quando dados posteriores comprovarem uma modificação real, registre separadamente sua execução.

---

# 4. SEÇÃO FINAL OBRIGATÓRIA — PROJEÇÕES FINANCEIRAS

Esta seção deve aparecer **no final do relatório, depois de toda a análise e do plano de ação**.

Quero uma projeção do desempenho da operação baseada nos dados históricos efetivamente disponíveis.

A projeção deve apresentar três cenários:

### CENÁRIO CONSERVADOR

Representa um desempenho abaixo da expectativa central, mas compatível com a distribuição de resultados recentes.

Considere dias fracos, queda de conversão e oscilações já observadas.

Não presuma recuperação.

### CENÁRIO BASE PROJETADO

Representa nossa estimativa central com base no comportamento recente da operação.

Utilize resultados reais e uma premissa de investimento definida.

Não presuma que qualquer aumento de orçamento preservará automaticamente a mesma eficiência.

### CENÁRIO OTIMISTA

Representa um desempenho melhor, porém ainda plausível à luz dos dados históricos.

Não utilize recordes excepcionais como projeção padrão.

Não invente aumento de conversão ou ROAS sem explicar a hipótese.

## Horizontes

Calcule projeções para:

**7 dias, 14 dias e 30 dias.**

Para cada horizonte, apresente os três cenários.

## Indicadores obrigatórios por cenário

| Indicador | Conservador | Base | Otimista |
|---|---|---|---|
| Investimento projetado | | | |
| Compras projetadas | | | |
| CPA projetado | | | |
| Receita bruta | | | |
| Receita líquida | | | |
| ROAS bruto | | | |
| Líquido/mídia | | | |
| Contribuição após mídia | | | |

As projeções podem ser exibidas em cards e gráficos já compatíveis com o design system do painel.

Apresente os valores monetários em reais e deixe explícito que são estimativas, não resultados confirmados.

## Metodologia obrigatória

Use preferencialmente uma base histórica de 14 a 30 dias completos, dando transparência ao desempenho dos últimos sete dias e a possíveis mudanças de estratégia.

Se houver menos dados, utilize somente o histórico disponível e reduza o nível de confiança da projeção.

Para construir os cenários, utilize uma metodologia estatística explícita, como os percentis 25, 50 e 75 da eficiência diária observada, desde que exista amostra suficiente.

A estimativa de gasto deve partir do orçamento diário conhecido ou do gasto diário recente quando o orçamento configurado não estiver disponível, sempre identificando a fonte.

As projeções de compras, faturamento e contribuição precisam ser matematicamente coerentes entre si.

Evite aplicar percentuais arbitrários de crescimento apenas para produzir cenários diferentes.

Os adicionais devem ser projetados separadamente, somente quando existir histórico suficiente de conversão e ticket desses produtos.

Se a amostra for insuficiente para uma projeção minimamente defensável, apresente a limitação em vez de fabricar números.

Inclua sempre um bloco com:

**Premissas da projeção**

Informe janela histórica, dias incluídos, investimento presumido, eficiência utilizada, ticket médio, tratamento dos bumps e limitações.

**Nível de confiança**

Classifique como baixo, moderado ou alto, explicando a classificação. Essa classificação deve refletir quantidade de dados, estabilidade e mudanças recentes na operação; não é uma probabilidade estatística formal.

**Riscos e oportunidades**

Explique o que pode levar o resultado real a ficar abaixo do conservador ou acima do otimista.

**Meta de faturamento**

Quando houver uma meta configurada, compare a projeção de 30 dias com essa meta.

Nossa referência inicial é recuperar o patamar de **R$10.000 em faturamento bruto móvel de 30 dias**.

Diferencie explicitamente a projeção dos próximos 30 dias de uma previsão do indicador móvel de 30 dias. Para projetar o indicador móvel, considere as vendas históricas que permanecerão na janela e aquelas que sairão dela.

---

# 5. Regras de apresentação e interpretação

Quero relatórios que possam ser lidos por um gestor para tomar decisões reais.

A ordem deve ser preservada, mas a análise não precisa ser repetitiva.

Use:

- Cards para KPIs.
- Tabelas para comparações.
- Gráficos para evolução.
- Textos explicativos para diagnóstico.
- Análises individuais para os criativos relevantes.
- Tabelas de decisão para alterações operacionais.
- Cenários financeiros para planejamento.

Mantenha tudo dentro da identidade visual atual.

**Não quero relatórios que sejam apenas uma sequência de métricas.**

Cada seção deve responder a perguntas concretas:

O que aconteceu?

Por que os dados sugerem esse comportamento?

Quais anúncios estão sustentando o resultado?

Onde estamos perdendo dinheiro?

Quais oportunidades merecem mais investimento?

O que precisamos alterar?

Qual é a perspectiva financeira dos próximos dias?

---

# 6. Implementação na ferramenta existente

Antes de alterar qualquer código:

1. Inspecione a arquitetura atual do projeto.
2. Identifique os componentes de cards, tabelas, gráficos e relatórios que já existem.
3. Reaproveite a identidade visual e os componentes existentes.
4. Preserve as funcionalidades atuais do Painel e Analytics.
5. Identifique as fontes de dados e a rotina de importação dos relatórios Meta e Hotmart.
6. Desenvolva a nova estrutura analítica sem reconstruir desnecessariamente a interface.
7. Garanta que os indicadores e projeções sejam derivados dos dados, não de valores fixos escritos no código.
8. Implemente validações para duplicidades, compras posteriores, dados ausentes e conciliação por SCK.
9. Permita selecionar um dia, intervalo personalizado e janelas históricas.
10. Faça testes de consistência financeira antes de considerar o módulo concluído.

Se existir uma camada de análise automatizada ou IA, ela deverá receber os dados já normalizados e conciliados, preservando os vínculos com suas fontes. Não deve ter liberdade para inventar informações ausentes.

Ao concluir, apresente o que foi implementado, quais regras estão operacionais, quais testes passaram, quais limitações permanecem e como os próximos relatórios serão gerados.

## CRITÉRIO FINAL DE ACEITAÇÃO

A nova ferramenta estará correta quando conseguir reproduzir a **profundidade estratégica, a sequência lógica e o nível de detalhamento** de nossas análises da MVAVE BR, utilizando a identidade visual já existente.

O relatório deve permitir que um gestor compreenda o resultado, identifique os criativos relevantes, veja evidências históricas, aprove decisões e visualize três projeções financeiras coerentes.

**O mais importante: não quero apenas saber quanto vendemos. Quero compreender o que está acontecendo com a operação, o que devemos fazer e o que podemos esperar financeiramente caso mantenhamos ou alteremos a estratégia.**