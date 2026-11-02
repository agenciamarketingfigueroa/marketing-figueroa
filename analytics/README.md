# Marketing Figueroa Analytics

Primeira implementação da plataforma privada para a operação Mvave BR, isolada do site estático existente. **Código e demonstração disponíveis; integrações reais, banco hospedado, cron e deploy ainda não ativados.** Nenhuma conta pessoal do Facebook foi acessada. O repositório Mvave BR não foi consultado nem alterado.

O passo a passo de autorização, identificadores recebidos, criativos, Instagram e tracking está em [docs/INTEGRACOES.md](docs/INTEGRACOES.md).

## Executar localmente

Requer Node.js 22 e npm. Na pasta `analytics`:

```sh
npm ci
npm run dev
```

Abra `http://127.0.0.1:3000/demo`. Em desenvolvimento, a demonstração não precisa de credenciais. Os dados são inteiramente fictícios, com período de 21/08/2026 a 01/11/2026. Nada é gravado no banco; ela não se atualiza com vendas reais.

Para prévia de produção, configure `ENABLE_DEMO=true` no ambiente local, execute `npm run build` e `npm start`. Use `ENABLE_DEMO=false` em produção para desativar `/demo`. Copie `.env.example` para `.env.local` somente quando for configurar a integração. Esse arquivo é ignorado pelo Git; não coloque segredos no `.env.example` nem no chat.

Neste computador, um Node portátil com checksum oficial foi instalado somente em `.tools/` (ignorado pelo Git). Para usar essa instalação no PowerShell, a partir da raiz do repositório:

```powershell
$env:Path = (Join-Path $PWD '.tools\node-v22.23.4-win-x64') + ';' + $env:Path
Set-Location analytics
npm.cmd run dev
```

## Arquitetura e arquivos

| Local | Responsabilidade |
| --- | --- |
| `src/app` | Rotas privadas, login, MFA, convite, demonstração e APIs |
| `src/components` | Dashboard, filtros, tabelas e formulários |
| `src/lib/domain.ts` | Dinheiro em unidades mínimas, métricas, datas e atribuição |
| `src/lib/coverage.ts`, `report-metrics.ts` | Cobertura confirmada dos provedores e bloqueio de totais incompletos |
| `src/lib/server` | Autorização, Supabase, adaptadores, sincronização e leitura de relatórios |
| `supabase/migrations` | Esquema, RLS, transações, leases e Realtime |
| `supabase/schedule.sql` | Instalação explícita dos cron jobs, depois do deploy |
| `tests` | Testes unitários, HTTP e SQL real em PostgreSQL WASM/PGlite |
| `scripts/http-smoke.mjs` | Verificação HTTP da aplicação executando localmente |
| `docs` | Auditoria, validação e limites da primeira versão |

Next.js + TypeScript + Recharts + CSS próprio. Supabase Auth, PostgreSQL e Realtime. O worker usa o runtime Node do Next.js; Supabase Cron/pg_net dispara requisições autenticadas independentemente de o dashboard estar aberto. Não há necessidade de duplicar os adaptadores em Edge Functions nesta versão. Vercel é o destino preparado, em deploy independente do GitHub Pages. Não há publicação automática neste trabalho.

Fluxo Hotmart: valida Hottok → limita requisições → valida e minimiza payload → transação PostgreSQL deduplica/atualiza pedido → Realtime invalida relatório → servidor relê com a sessão do usuário e RLS. A interface também consulta a cada 60 segundos para recuperar notificações perdidas.

Fluxo Meta: cron autenticado → claim de lease exclusivo → API de leitura com paginação → valida todas as páginas → substitui janela em uma única transação → registra sucesso → Realtime. Credenciais só existem no servidor.

## Provisionar Supabase

1. Criar um projeto dedicado para Analytics. Não usar nem migrar serviços da Mvave BR.
2. Desativar cadastro público nas configurações de Auth, incluindo cadastro por e-mail. Não habilitar login anônimo nem Facebook OAuth.
3. Habilitar TOTP, senha mínima de 12 caracteres, limites de login e SMTP administrativo. O frontend não fornece formulário de cadastro. A configuração local de referência está em `supabase/config.toml`; as opções devem ser repetidas no projeto hospedado.
4. Aplicar migrations em ordem pelo SQL Editor ou pela CLI oficial (`supabase link`, `supabase db push` a partir de `analytics`). Não executar `db reset` em produção.
5. Configurar `NEXT_PUBLIC_SUPABASE_URL` e `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`. A publishable key é pública por definição, mas não autoriza leitura de dados sem sessão e RLS. A `SUPABASE_SERVICE_ROLE_KEY` é exclusivamente do servidor.
6. Habilitar as tabelas da migration Realtime na publicação `supabase_realtime`, se necessário. Todas permanecem com RLS.

Para criar a organização e as contas, use IDs reais conferidos, em sessão administrativa no Supabase. O exemplo abaixo contém somente marcadores, sem credenciais:

```sql
insert into public.organizations(name) values ('Mvave BR') returning id;
-- Substitua os marcadores, sem gravar IDs/segredos privados no repositório:
insert into public.ad_accounts(organization_id,id,name,currency,timezone)
values ('<uuid-da-organizacao>','<id-meta-sem-act_>','Mvave BR','BRL','America/Sao_Paulo');
insert into public.hotmart_accounts(organization_id,id,name)
values ('<uuid-da-organizacao>','<identificador-interno-hotmart>','Mvave BR');
```

### Administrador, convite e MFA

O administrador do projeto convida o primeiro usuário pelo painel Supabase Auth; não há convite público no aplicativo. Configure Site URL e URLs permitidas para a origem HTTPS do Analytics.

Nos templates de convite/recuperação, use respectivamente os links:

```text
{{ .SiteURL }}/auth/confirm?token_hash={{ .TokenHash }}&type=invite
{{ .SiteURL }}/auth/confirm?token_hash={{ .TokenHash }}&type=recovery
```

Após convidar, cadastre o UUID retornado pelo Auth em `organization_members` com `role='admin'` e a organização correta. Usuários de leitura recebem `role='viewer'`. A UI não permite se promover nem editar associações. Alterações administrativas são feitas em sessão privilegiada por responsável autorizado e devem ser registradas em `audit_logs` sem dados sensíveis.

O convidado define sua própria senha e cadastra um autenticador TOTP em `/mfa`. Tanto administradores quanto leitores precisam de AAL2 para acessar os dados. O servidor verifica usuário e claims; RLS verifica novamente organização e AAL2. Logout encerra a sessão local. Para perda do autenticador, a recuperação deve ser feita pelo administrador após verificação de identidade; nunca remover MFA/RLS para contornar problemas.

## Credenciais e contas

| Variável | Uso |
| --- | --- |
| `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` | SDK público; protegido por Auth/RLS |
| `SUPABASE_SERVICE_ROLE_KEY` | Escrita pelo worker; nunca frontend |
| `SYNC_ORGANIZATION_ID` | UUID da organização cadastrada |
| `META_AD_ACCOUNT_ID` | ID numérico, sem prefixo `act_` |
| `META_ACCESS_TOKEN` | Token de integração autorizado, leitura |
| `META_HISTORY_START` | Início do histórico Meta, padrão 2026-08-21 |
| `INSTAGRAM_ACCOUNT_ID`, `INSTAGRAM_USERNAME` | ID numérico e perfil profissional esperado |
| `INSTAGRAM_ACCESS_TOKEN`, `INSTAGRAM_GRAPH_VERSION` | Token de leitura e versão para Graph API Instagram |
| `HOTMART_PRODUCT_IDS` | IDs permitidos separados por vírgula; obrigatório |
| `META_GRAPH_VERSION` | Versão suportada pelo aplicativo Meta, explícita; não há default inventado |
| `HOTMART_ACCOUNT_ID` | Identificador interno correspondente ao banco |
| `HOTMART_CLIENT_ID`, `HOTMART_CLIENT_SECRET`, `HOTMART_BASIC_AUTH` | Credenciais oficiais da API |
| `HOTMART_HOTTOK` | Segredo para autenticar webhooks |
| `HOTMART_PARTICIPANT_ID` | Ucode do participante financeiro, opcional; necessário para líquido |
| `HOTMART_HISTORY_START` | Data UTC `AAAA-MM-DD` para iniciar varredura histórica |
| `CRON_SECRET` | Segredo aleatório de pelo menos 32 caracteres |
| `ENABLE_DEMO` | `false` em produção; `true` apenas para prévia explicitamente fictícia |

Configure segredos pelo painel de hospedagem e pelo Vault. Não compartilhe senhas pessoais. A aplicação inicial possui **uma organização e uma conta de cada provedor configuradas por ambiente**. As chaves compostas e o esquema suportam expansão; o dispatcher de múltiplas contas e a interseção de coberturas ainda precisam ser implementados antes de habilitar mais contas.

## Meta Ads sem sessão pessoal

O responsável pelo Business da operação provisiona uma integração oficial com usuário de sistema autorizado e acesso somente à conta necessária, quando disponível para a configuração do negócio. Priorize `ads_read`. Não solicitar `ads_management` para este dashboard. Permissões, revisão e elegibilidade do aplicativo devem ser confirmadas no ambiente Meta pelo responsável.

O Analytics usa somente HTTPS para `graph.facebook.com`, com Bearer token no servidor. Não usa cookies do Facebook, navegador, scraping ou automação do Gerenciador de Anúncios.

As prévias dos criativos são obtidas por `image_url`/`thumbnail_url`, e servidas por endpoint privado com MFA/RLS e lista de CDNs permitidas. Vídeos mostram capa; criativos dinâmicos e versões históricas não são reconstruídos.

A rotina lê insights diários em nível de anúncio, incluindo campanhas/conjuntos e seus nomes; busca status efetivo e orçamentos em consulta separada. Usa atribuição unificada dos conjuntos e `action_report_time=conversion`, alternando os últimos 28 dias com semanas históricas desde `META_HISTORY_START` enquanto completa a carga inicial (depois, mantém a janela recente). Compra é a ação `purchase`; aliases sobrepostos não são somados. Campos ausentes permanecem indisponíveis.

O fuso da conta precisa ser `America/Sao_Paulo` nesta primeira versão. Contas em outro fuso são recusadas em vez de juntar dias incompatíveis. Não há conversão automática de moeda. Alcance e frequência não são somados entre anúncios/dias; frequência consolidada permanece indisponível.

Há paginação por cursor, limite de segurança de 100 páginas, backoff para falhas transitórias e rate limits, respeito a Retry-After e timeout. Se qualquer página falhar, a janela anterior é preservada. Tokens não seguem URLs arbitrárias de paginação nem redirects. Sem sucesso real de API, a integração não pode ser considerada ativa.

## Instagram

A conta profissional vinculada à Página usa token autorizado separado, sem sessão pessoal no dashboard. Coleta `followers_count` a cada hora e preserva o último registro de cada dia. História anterior à primeira coleta exige registros verificáveis; não existe backfill automático de seguidores. Ver instruções e permissões em [INTEGRACOES.md](docs/INTEGRACOES.md).

## Hotmart: webhook e conferência

Configure webhook **v2.0.0**, conta de produtor, em `https://<analytics>/api/webhooks/hotmart`. O Hottok deve chegar no cabeçalho `X-HOTMART-HOTTOK`, antes de qualquer processamento. Nunca colocá-lo na URL.

`HOTMART_PRODUCT_IDS` limita o webhook e a conciliação aos produtos configurados. Sem lista válida, o processamento financeiro é bloqueado. Uma mudança posterior do escopo requer reconciliação dos dados e da cobertura.

Eventos implementados: `PURCHASE_APPROVED`, `PURCHASE_COMPLETE`, `PURCHASE_CANCELED`, `PURCHASE_REFUNDED`, `PURCHASE_CHARGEBACK`, `PURCHASE_BILLET_PRINTED`, `PURCHASE_PROTEST`, `PURCHASE_EXPIRED` e `PURCHASE_DELAYED`. Status pendentes adicionais são conciliados pela API. Cada renovação é uma transação independente. Cancelamento de assinatura não equivale a reembolso: eventos não financeiros são registrados como ignorados, sem alterar pedidos.

- Validação Zod, máximo de 256 KiB, limite compartilhado de 300 requisições autenticadas/minuto/conta, com 429 e Retry-After. Configure também rate limiting por IP no WAF da hospedagem para tráfego não autenticado.
- Unique por organização + conta + evento; hash da projeção financeira detecta conflito de ID. Pedido único por transação. Uma falha de persistência não grava marcador de sucesso; retorna 503 para permitir reenvio do provedor.
- Processamento transacional e lock por pedido. Eventos são ordenados pelo instante do provedor, não pela chegada. O relógio de observação da API é separado do relógio do webhook.
- Snapshot em andamento não sobrescreve webhook recebido depois do início da consulta. Reembolsos/chargebacks não voltam a aprovados por leitura atrasada. Reversões excepcionais exigem conciliação administrativa documentada.
- O valor bruto é `purchase.full_price` no webhook e `purchase.price` no histórico: **total pago pelo comprador, inclusive juros/tributos**, conforme os contratos consultados. Não é a base líquida de comissionamento. O valor da oferta não é misturado com total pago.
- O líquido é a soma das comissões do **participante explicitamente configurado**, somente na mesma moeda da compra. Sem participante ou com moedas diferentes, fica indisponível; nunca subtrair taxas estimadas. Nenhum nome ou e-mail de participante/comprador é armazenado.
- Order bumps preservam identificador próprio e vínculo ao pai. Totais somam pedidos uma vez; não somam novamente bundles/itens. `is_funnel` registra participação em funil, sem inventar classificação de upsell/downsell.
- Webhook requer campos financeiros do produtor. Payloads de afiliado sem `full_price` são rejeitados; não há fallback para um preço com semântica diferente.

O cron alterna varredura recente (7 dias) e um dia histórico desde `HOTMART_HISTORY_START`, consultando explicitamente todos os status documentados do histórico, com paginação. Cursor persiste somente após página totalmente processada. Reexecução é idempotente. Ao completar todos os status de uma janela, registra a cobertura. Histórico extenso exige vários lotes; a interface bloqueia totais/razões quando a cobertura ainda não inclui o período selecionado. Webhooks são o caminho de menor latência. Hoje é parcial até a última consulta concluída.

O detalhamento de comissões limita páginas a 10 pedidos quando habilitado, para caber no orçamento de execução. Em operações volumosas ou lentas, migrar para fila de tarefas por transação, sem aumentar timeout indefinidamente.

## Atribuição e cálculos

`attribution_mapping` associa conta Hotmart, produto/oferta e um valor exato de SRC/SCK/XCOD/UTM a conta/campanha/conjunto/anúncio. Cadastre somente relações verificadas. Chaves estrangeiras impedem cruzamento de organizações. Conflitos entre identificadores resultam em **Origem não identificada**. Não fazer matching por nome nem usar os IDs arredondados do piloto.

Webhooks e histórico preservam SRC/SCK/XCOD quando recebidos. UTMs só entram se um canal confiável fornecer esses campos explicitamente; não são extraídas por heurística. A UI filtra produto e conta usando essas relações: um produto inclui apenas mídia de anúncios mapeados e uma conta exclui vendas sem identificação. O recorte é sinalizado.

- Receita e vendas aprovadas: `APPROVED` + `COMPLETE`, pela data de aprovação em São Paulo.
- Pedidos sem aprovação usam data do pedido. Reembolsos/chargebacks são apresentados no período da aprovação original, não como fluxo de caixa na data de devolução. Reembolso parcial não recebe valor restante estimado.
- MER: bruto Hotmart / gasto total. ROAS Meta: valor atribuído Meta / gasto. ROAS Hotmart: bruto de vendas com origem verificável / gasto do recorte.
- Funil: custo por PV, Connect Rate (PV/cliques), custo por checkout, PV→checkout e PV→compra. PV significa visualização da página de destino. Seguidores têm série própria, independente de produto/moeda. Gráficos incluem acumulados desde 21/08/2026 e não atravessam lacunas de cobertura.
- CPA exibido: gasto / compras reportadas pela Meta. CPC/CTR são de cliques no link. Taxas usam somas, nunca média de taxas.
- Resultado após mídia: comissão/líquido apurado − mídia; não representa lucro contábil completo.
- Período anterior tem igual número de dias; base zero/ausente não produz variação. Moedas nunca são somadas. Valores monetários são inteiros na escala da moeda; CSV converte explicitamente para unidade monetária e informa filtros/unidades.

## Cron, Realtime e monitoramento

Após configurar Vercel e testar APIs, habilite pg_cron, pg_net e Vault no Supabase. Cadastre no Vault `analytics_base_url` (origem HTTPS sem barra final) e `analytics_cron_secret`. O segredo deve coincidir com `CRON_SECRET` do servidor. Execute `supabase/schedule.sql`.

Meta roda em `*/5 * * * *`; Hotmart em `2-59/5 * * * *`, para distribuir carga. A chamada é POST, com Bearer, e a rota aceita `meta`, `hotmart` e `instagram`. Instagram usa job opcional separado em `supabase/schedule-instagram.sql`, a cada hora. Não habilite um segundo scheduler simultaneamente. A lease tem quatro minutos, token de execução e verificação nas escritas; execução Next limitada a 180 segundos com orçamento interno de 145 segundos.

No painel, confira conexão Realtime, último lote concluído, último webhook e erros. `last_success` significa **último lote**, não conciliação integral do histórico. `sync_jobs.cursor.coverage` informa janelas completas. Confira também `sync_logs`, `cron.job_run_details` e respostas de `net._http_response`; o sucesso de pg_net ao enfileirar HTTP não comprova sucesso do worker. Alertas externos ainda precisam ser configurados para falhas ou ausência prolongada de sucesso.

Um endpoint sem configuração retorna 503; segredo inválido retorna 401. Não registra cabeçalhos, tokens, corpos brutos ou mensagens integrais de erro do provedor. Configure logs da hospedagem sem corpos de webhook e sem query strings de convites.

## Deploy separado e recuperação

1. Criar projeto Vercel apontando a este repositório, **Root Directory `analytics`**, framework Next.js, Node 22. O GitHub Pages e o CNAME existentes permanecem intactos.
2. Configurar segredos, `ENABLE_DEMO=false` e URLs Supabase antes do build. Rebuild após mudanças de variáveis públicas.
3. Confirmar plano com duração de função de pelo menos 180 segundos e limites adequados. Proteger o preview; não conectar previews a dados de produção por padrão.
4. Aplicar migrations no projeto dedicado, criar organização, contas, administrador e mapeamentos.
5. Testar MFA, usuário sem organização, usuário de outra organização, webhook de teste/reenvio, compra/reembolso, paginação real, valores e fuso contra os painéis oficiais.
6. Só então ativar cron e, se desejado, configurar um subdomínio administrativo. Testar com navegador fechado. Não alterar domínio do site público.

Não há segredos em tabelas públicas. Backup deve incluir Postgres, memberships e mapeamentos; segredos têm gestão separada na hospedagem/Vault. Habilitar backups automáticos/PITR conforme o plano contratado, testar restauração em projeto isolado e documentar RPO/RTO antes do lançamento. `sync_logs` são retidos por 90 dias; limites por um dia. Chaves de idempotência e registros financeiros não são removidos automaticamente. Definir a política de retenção financeira aplicável antes de produção.

Para revogar acesso: remover vínculo de organização, encerrar sessões do usuário no Auth e, quando necessário, revogar token do usuário de sistema Meta/credenciais Hotmart. Rotacionar segredos no ambiente e no Vault coordenadamente. Rotação do Hottok segue o procedimento oficial Hotmart. Pausar jobs nomeados pelo Supabase Cron durante manutenção; nunca desativar RLS.

## Validação e limites conhecidos

```sh
npm run check
npm run build
npm audit --omit=dev
# Com prévia de produção executando e ENABLE_DEMO=true:
node scripts/http-smoke.mjs
```

A suíte executa as migrations em PostgreSQL WASM e testa RLS com roles distintas, MFA/AAL, eventos fora de ordem, duplicidade, atomicidade, leases, rate limit, contratos, cálculos, cobertura e filtros. Isso não substitui a validação no Supabase hospedado nem em contas reais.

Veja `docs/VALIDACAO.md` para resultados e verificações pendentes. A revisão visual de desktop/celular ficou pendente por indisponibilidade do controle de navegador. Não declarar a interface visualmente homologada sem essa etapa.

Limites desta versão: janela Meta recente de 28 dias e backfill semanal desde 21/08/2026; consultas de relatório limitadas a 3.660 dias e 20 mil registros por tabela, recusando excesso sem truncar totais; tabelas de pedidos mostram os primeiros 100 registros; múltiplas contas ainda exigem dispatcher/cobertura próprios; líquido em outra moeda permanece indisponível; alertas externos/backup hospedado dependem de configuração. Históricos criptografados do piloto não são importados nem descriptografados automaticamente. O esquema reserva itens e auditoria, mas não implementa uma UI de administração financeira.

## Contratos oficiais consultados

- [Next.js — instalação](https://nextjs.org/docs/app/getting-started/installation)
- [Supabase — SSR e validação de sessão](https://supabase.com/docs/guides/auth/server-side/creating-a-client?queryGroups=framework&framework=nextjs)
- [Meta — Insights API](https://developers.facebook.com/docs/marketing-api/insights/)
- [Hotmart — webhook v2](https://developers.hotmart.com/docs/en/2.0.0/webhook/purchase-webhook/)
- [Hotmart — histórico](https://developers.hotmart.com/docs/en/v1/sales/sales-history/)
- [Hotmart — comissões](https://developers.hotmart.com/docs/en/v1/sales/sales-commissions/)

Os schemas públicos da Hotmart também foram conferidos no `page-data.json` do portal oficial. Payloads e permissões ainda precisam ser validados com o ambiente real da operação.
