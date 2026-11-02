# Integração da operação Mvave BR

O layout pode ser acompanhado em `http://127.0.0.1:3001/demo` enquanto o servidor local estiver ligado. É uma demonstração com dados fictícios. Um endereço público dependerá da publicação do projeto Analytics separado do site existente.

## Identificação recebida

O ID da conta de anúncios, o perfil **@mvavebr** e os nove IDs de produtos foram recebidos e preparados em `analytics/.env.local`, ignorado pelo Git. Nenhum token foi recebido e nenhuma conta foi conectada. Os nomes/IDs reais não são usados para apresentar métricas fictícias como resultados reais.

Produtos informados: Pack completo; Pack de Baixo; Pack de Guitarra; Pack de Violão; Código do Timbre: Violão; Código do Timbre: Baixo; Código do Timbre: Guitarra; Guia de Bolso do Timbre; Descomplicando o Dadgad.

O link curto `fb.me` não pôde ser resolvido pela consulta pública. Ele não substitui o ID da conta nem a autorização da API. Um ID identifica um recurso; o acesso depende de token e permissões. Não foi utilizada a sessão pessoal do Facebook.

## 1. Preparar o ambiente do Analytics

Criar Supabase dedicado, aplicar as três migrations em ordem e cadastrar organização, contas e usuário convidado com MFA, conforme [README](../README.md). Criar projeto Vercel com Root Directory `analytics`, separado do GitHub Pages. O endpoint Hotmart precisa de HTTPS público; localhost não recebe webhooks externos.

Copiar os valores de `.env.example` para o ambiente da hospedagem. A configuração local já contém os identificadores enviados; preencher somente os campos restantes em `.env.local` para desenvolvimento. Segredos devem ser digitados diretamente nesse arquivo ou no painel seguro da hospedagem, nunca no chat, código, Git ou URLs. Variáveis com prefixo `NEXT_PUBLIC_` nunca recebem tokens privados.

## 2. Autorizar a leitura de Meta Ads

O administrador da empresa realiza esta etapa no próprio ambiente Meta:

1. Acessar [Configurações do negócio](https://business.facebook.com/settings) e conferir o portfólio empresarial e a conta de anúncios informada. Não mover nem remover a conta.
2. Criar/configurar aplicativo empresarial com Marketing API, vinculado ao negócio. Conferir elegibilidade, modo do aplicativo e eventual revisão exigida pela Meta.
3. Em **Usuários → Usuários do sistema**, quando disponível para esse negócio, criar uma identidade de integração e conceder acesso de análise/leitura somente à conta necessária. Não conceder administração de campanhas para este dashboard.
4. Gerar token autorizado para o aplicativo com `ads_read`. Este código não precisa de `ads_management`; não cria, edita, pausa ou exclui anúncios. Os requisitos efetivos devem ser conferidos no painel do aplicativo antes da ativação.
5. Configurar `META_ACCESS_TOKEN`, `META_AD_ACCOUNT_ID` e `META_GRAPH_VERSION` no servidor. O ID já está preparado localmente. Escolher uma versão suportada pelo aplicativo; não copiar uma versão antiga de tutorial. Manter `META_HISTORY_START=2026-08-21`.
6. Validar um lote e comparar gasto, cliques, compras e ROAS com o Gerenciador, usando o mesmo fuso e atribuição. Somente depois habilitar o cron.

Os endpoints Meta usados são GET. O código não acessa cookies, navegador ou a sessão pessoal do Facebook. A documentação oficial distingue o ID do recurso do token que autoriza acesso: [Business SDK da Meta](https://github.com/facebook/facebook-python-business-sdk#obtain-an-access-token).

Compartilhar um ID não fornece autorização de API. Não é possível prometer ausência absoluta de restrições da plataforma. A integração deve manter permissões mínimas, credenciais protegidas, atendimento às políticas da Meta e limites de chamadas. O worker limita paginação, não repete erros de autenticação e aplica backoff/Retry-After a falhas transitórias. Erros devem ser resolvidos antes de manter jobs falhando continuamente. Referências: [autenticação](https://developers.facebook.com/docs/marketing-api/overview/authentication/) e [limites da API](https://developers.facebook.com/docs/marketing-api/overview/rate-limiting/).

As imagens vêm de `image_url` ou `thumbnail_url` do criativo. O servidor só permite CDNs Meta em HTTPS e entrega a imagem após autenticação, MFA e RLS. Não abre o anúncio no Facebook. Vídeos mostram capa; carrosséis/dinâmicos não representam todas as variações. É o criativo atual associado ao anúncio, não um arquivo de versões históricas. Campos oficiais: [AdCreative no SDK Meta](https://github.com/facebook/facebook-python-business-sdk/blob/main/facebook_business/adobjects/adcreative.py).

## 3. Conectar @mvavebr

Esta implementação usa **Instagram API com Facebook Login/Graph API**, com autorização empresarial de integração; não implementa um login pessoal no dashboard nem o fluxo alternativo Instagram Login.

É necessário perfil profissional (Business/Creator) vinculado a uma Página, ID numérico da conta Instagram e token autorizado para leitura desse ativo. O `@` não é o ID numérico. O administrador obtém o ID nas ferramentas oficiais do aplicativo/Página autorizada; não precisa enviar senha. Conferir `instagram_basic` e `pages_read_engagement` para esse fluxo e `pages_show_list` caso seja necessário descobrir a Página. Não conceder publicação ou moderação de comentários para contar seguidores.

Configurar `INSTAGRAM_ACCOUNT_ID`, `INSTAGRAM_ACCESS_TOKEN`, `INSTAGRAM_GRAPH_VERSION` e `INSTAGRAM_USERNAME=mvavebr`. A integração valida tanto o ID retornado quanto o nome esperado. O token precisa ser compatível com essa modalidade e com os ativos autorizados; um token de Instagram Login não deve ser colocado nesse campo por suposição.

O endpoint consulta `id,username,followers_count`. O job opcional em `supabase/schedule-instagram.sql` coleta a cada hora e preserva o último registro de cada dia em São Paulo. A variação usa registros existentes, com data da base visível. **O histórico de seguidores desde agosto não é fabricado:** para datas anteriores à primeira coleta, será necessário um histórico verificável e um importador específico, ainda não implementado.

Referências oficiais: [coleção Instagram da Meta](https://www.postman.com/meta/instagram/documentation/6yqw8pt/instagram-api), [campos IGUser](https://github.com/facebook/facebook-python-business-sdk/blob/main/facebook_business/adobjects/iguser.py).

## 4. Conectar a Hotmart e os nove produtos

1. Na Hotmart, abrir as ferramentas de desenvolvedor/credenciais e criar credenciais para a API da conta responsável pelas vendas. Configurar `HOTMART_CLIENT_ID`, `HOTMART_CLIENT_SECRET` e `HOTMART_BASIC_AUTH` no servidor.
2. Configurar `HOTMART_ACCOUNT_ID` como identificador interno cadastrado no Supabase. Configurar `HOTMART_PRODUCT_IDS` com os nove IDs enviados, separados por vírgula; localmente isso já está preparado. O importador e o webhook não persistem pedidos de outros produtos. Lista ausente bloqueia a importação.
3. Criar webhook v2 para os nove produtos, apontando a `https://<dominio-do-analytics>/api/webhooks/hotmart`. Selecionar os eventos financeiros documentados no README. Configurar `HOTMART_HOTTOK` no servidor, recebido no cabeçalho `X-HOTMART-HOTTOK`.
4. Manter `HOTMART_HISTORY_START=2026-08-21`. A API fará a importação histórica em lotes; o webhook atende eventos novos. A tela só libera totais do período quando a cobertura estiver completa.
5. Se quiser comissão/líquido, configurar também `HOTMART_PARTICIPANT_ID` (ucode do participante correto). Sem isso o bruto pode ser apurado, mas líquido e resultado após mídia ficam indisponíveis.
6. Enviar evento de teste oficial e conferir uma transação aprovada e um reembolso. Conferir moeda, total pago, produto e origem com o painel Hotmart antes de habilitar o cron.

Referências: [webhook de compra](https://developers.hotmart.com/docs/en/2.0.0/webhook/purchase-webhook/), [histórico de vendas](https://developers.hotmart.com/docs/en/v1/sales/sales-history/), [comissões](https://developers.hotmart.com/docs/en/v1/sales/sales-commissions/).

Se a lista de produtos mudar depois da implantação, reconciliar o escopo armazenado e reiniciar a cobertura Hotmart de forma administrativa antes de considerar totais completos; alterar uma variável não limpa dados antigos nem importa retrospectivamente os produtos recém-incluídos.

## 5. Conferir tracking e ligar atualização automática

O ID de produto não identifica qual anúncio gerou a venda. É necessário um valor confiável de SRC/SCK/XCOD recebido pela Hotmart e seu mapeamento explícito para conta/campanha/conjunto/anúncio em `attribution_mapping`. Enviar depois um exemplo do link de destino já usado em um anúncio e do link de checkout, sem tokens ou dados pessoais, permite conferir esse caminho. Nenhum parâmetro de anúncio ou código do repositório Mvave BR será alterado automaticamente.

Não atribuir vendas pela semelhança de nomes. Sem origem verificável, a venda continua no financeiro, mas fica sem atribuição no tracking. ROAS Meta e ROAS Hotmart são exibidos separadamente; MER inclui toda a receita aprovada do recorte.

Após os testes, configurar Vault e executar `supabase/schedule.sql` (Meta/Hotmart) e, se Instagram estiver validado, `supabase/schedule-instagram.sql`. Meta alterna janela recente de 28 dias e semanas históricas desde 21/08/2026 enquanto completa a carga inicial. Hotmart alterna últimos 7 dias e dias históricos. O browser recebe Realtime e consulta novamente a cada 60 segundos; fechar o dashboard não interrompe o cron hospedado.

## Indicadores apresentados

| Indicador | Cálculo |
| --- | --- |
| CPC | Gasto ÷ cliques no link |
| Page View de destino | `landing_page_view`, diferente do PageView genérico do pixel |
| Custo por PV | Gasto ÷ visualizações da página de destino |
| Connect Rate | Visualizações da página de destino ÷ cliques no link × 100 |
| Custo por Initiate Checkout | Gasto ÷ checkouts iniciados |
| PV → checkout | Checkouts iniciados ÷ visualizações da página de destino × 100 |
| Custo por compra | Gasto ÷ compras atribuídas pela Meta |
| PV → compra | Compras Meta ÷ visualizações da página de destino × 100 |
| ROAS Meta | Valor de compras atribuído pela Meta ÷ gasto |
| ROAS Hotmart com tracking | Bruto aprovado com origem mapeada ÷ gasto |
| Tracking | Vendas aprovadas com origem mapeada ÷ vendas aprovadas × 100 |

As taxas usam somas do recorte, não médias de taxas diárias. Denominadores zero e dados desconhecidos resultam em indisponível. Eventos das diferentes etapas não constituem uma coorte única. Gráficos acumulados começam no início do recorte e não atravessam dias sem cobertura com zeros inventados.
