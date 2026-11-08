# Central de inteligência Marketing Figueroa

Antes de analisar novos arquivos, leia `PROMPT_MESTRE_CODEX_MVAVE_BR.md`, `analise-mvave-br/config/`, os últimos relatórios e `analise-mvave-br/historico/decisoes.md`.

- Hotmart é a verdade financeira; Meta é entrega e conversões reportadas. Nunca inventar histórico nem preencher lacunas com zero.
- MVAVE BR: PERFORMANCE + LAB em ABO; Método Del SUSPENSO. PERFORMANCE pode ser classificação analítica, sem campanha física confirmada.
- SCK só atribui diretamente quando corresponde ao ID exato, textual e íntegro do anúncio. IDs arredondados, nomes e prefixos não comprovam atribuição. Sem SCK = blended. Preservar conversões tardias no anúncio original; divisão por zero é indisponível.
- Separar operações, moedas, principais, bumps e upgrades. Produtos desconhecidos ficam REVISAR. Bumps não são compradores. Compradores únicos exigem identificador seguro.
- Comparar dias e janelas reais (3/7/14/30), sem ratear exports agregados. Contribuição = líquido − mídia, não lucro final. Toda recomendação é proposta, nunca ação executada.
- Não alterar campanhas, páginas de vendas, integrações reais, credenciais ou agendamentos sem instrução explícita. As alterações autorizadas nesta tarefa são ferramentas internas e importação local.
- Preservar fontes, hashes, snapshots e revisões. Dados brutos e pessoais ficam em `analise-mvave-br/dados/`, ignorado pelo Git e bloqueado no servidor local. Publicar somente pacote criptografado; nunca credenciais.
- O site existente é estático/GitHub Pages, não um projeto hospedado no Sites. Não criar hospedagem paralela. Compilar com `npm run build:manual` em `analytics`.
- Nova cliente: criar perfil somente após reunião e implementação de 09/11/2026, conforme solicitação do usuário. Clientes sem exports mostram estado vazio.
- Verificar importação com testes Node em `analise-mvave-br/testes/`, testes de Analytics, typecheck e build manual. Não modificar dados anteriores silenciosamente.
