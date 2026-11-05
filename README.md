# Marketing Figueroa

## Painel — apresentação da operação

Nova ferramenta em [`clientes/painel/`](clientes/painel/index.html), com atalhos na Área Interna e no Analytics. Usa o mesmo login de administrador e o mesmo pacote criptografado do Analytics. Não altera os arquivos importados. Depois da publicação habitual do repositório, o endereço será `https://marketingfigueroa.com.br/clientes/painel/`.

A apresentação separa visão geral, dia a dia, mídia paga, vendas, Instagram, Produtos (Visão Geral), Produtos (Detalhamento), criativos e Projeções (Visão Geral, Acompanhamento e Base/Método). O detalhamento de produtos é paginado automaticamente, com até seis produtos por lâmina. Com os dados até 04/11, são 12 lâminas. Todas participam da reprodução automática.

Em monitores a partir de 900 px de largura, cabeçalho e rodapé ficam dentro da altura da janela. O conteúdo de cada lâmina é ajustado proporcionalmente ao espaço restante, recalculando ao mudar a janela, a tela cheia, a lâmina ou seu conteúdo. Não exige rolagem para assistir. Em celulares, o conteúdo mantém o fluxo responsivo. Setas, botões, pausa com espaço, intervalos de 10/20/30/60 segundos e tela cheia continuam disponíveis. Movimento reduzido desativa transições e inicia pausado; interagir com o conteúdo pausa a reprodução.

Consulta o pacote publicado a cada cinco minutos enquanto a aba está visível. Isso não coleta dados das plataformas: uma nova importação precisa ser publicada pelo fluxo existente. Todo o histórico acompanha as novas datas, e a visão diária usa o último dia disponível enquanto não houver dia fixado. O relógio segue Brasília e o acesso mantém a sessão existente de oito horas.

Produtos mostram vendas, bruto, líquido, ticket e CPA apenas com vínculo exclusivo e verificável entre anúncios e produto. Criativos reutilizam a galeria do Analytics, com quatro destaques, ordenação e gasto mínimo. Projeções usam a média diária ponderada de até três meses calendário completos nos últimos seis meses, multiplicada pelos dias do próximo mês calendário. Cenários de ±20% mantêm o investimento e variam o resultado; não são intervalos de confiança. O realizado é comparado com o previsto até a mesma data, separadamente por provedor. **Fixar projeção** preserva a estimativa no armazenamento criptografado deste navegador; baixar/restaurar permite transportá-la sem substituir estimativas já fixadas.

ROAS Meta = valor de conversão Meta ÷ gasto; MER = bruto Hotmart ÷ gasto; resultado após mídia = líquido − gasto. Sem valor de conversão no recorte, o destaque do Painel usa MER e identifica a ausência de ROAS. Oficina do Violão continua aguardando exports.

Para regenerar o JavaScript, execute `npm run build:manual` em `analytics/`. Testes de lâminas, paginação, cobertura, projeções e persistência estão em `analytics/tests/board*.test.ts` e `analytics/tests/manual.test.ts`.

### Atualização diária até 04/11/2026

Os quatro exports Meta diários de agosto a novembro substituem o gasto, impressões e compras agregados no histórico diário. Os totais de agosto, setembro e outubro foram reconciliados exatamente com os anteriores. O arquivo Hotmart de 01 a 04/11 foi acrescentado. O pacote continua criptografado; arquivos originais, compradores e códigos de origem não são publicados. O Instagram permanece com cobertura até 31/10.

Os novos exports Meta **não contêm** cliques, visitas, checkouts, valor de conversão nem IDs dos anúncios. Portanto, gasto e CPA diários estão disponíveis, mas ROAS e funil diários não. Os detalhes dos exports anteriores são preservados em `manualMetaAggregates` e substituem os registros diários somente quando um período histórico completo é selecionado. Nunca são somados aos mesmos dias. A série diária sempre usa os registros diários. Grupos diários com nome/conjunto iguais são consolidados, sem assumir um ID original ou atribuição Hotmart.

O importador `scripts/import-manual-daily.mjs` recebe um manifesto JSON com listas `meta` e `hotmart`; cada entrada informa `path`, `start`, `end` e `month`. Datas devem representar a cobertura real dos arquivos. Cada dia Meta precisa estar presente; divergências históricas, sobreposições parciais e transações repetidas são recusadas. Use a chave existente pela entrada padrão:

```powershell
Read-Host 'Chave de dados' | & .\.tools\node-v22.23.4-win-x64\node.exe scripts/import-manual-daily.mjs 'C:\caminho\manifesto.json' assets/reports/manual-analytics.enc.json --dry-run
```

Depois da conciliação, execute sem `--dry-run`. O importador verifica a criptografia e substitui o pacote atomicamente. Novos períodos exigem exports Meta e Hotmart correspondentes. Não reutilize os importadores agregados para substituir este pacote diário. Verifique com `scripts/check-manual-analytics.mjs` (chave via stdin) e execute os testes `node --test scripts/check-manual-meta.mjs scripts/check-manual-daily-import.mjs`.

### Rotina recomendada para os dados diários

Para a análise diária, o ganho vem da granularidade dos registros, não da quantidade de arquivos. Na Meta, exportar por **dia e anúncio**, com data, nomes/IDs de campanha/conjunto/anúncio, gasto, impressões, cliques no link, visitas à página, checkouts, compras e valor de conversão. Manter os IDs como texto para evitar arredondamento. É possível selecionar um período maior e usar a divisão por dia no relatório: [orientação oficial sobre exportação Meta com detalhamento diário](https://support.google.com/analytics/answer/16748649?hl=en#meta).

O histórico diário de gasto, impressões e compras de 21/08 a 04/11 já foi importado. Para completar ROAS e funil diários, incluir também cliques, visitas, checkouts e valor de conversão. Preservar IDs como texto para não perder precisão. Enviar períodos novos sem sobreposição, com as mesmas datas de cobertura na Meta e na Hotmart. O importador diário mantém os detalhes históricos sem duplicar os totais.

## Analytics manual — ferramenta da Área Interna

O Analytics com o layout da aplicação original está em [`clientes/analytics/`](clientes/analytics/index.html) e aparece diretamente na Área Interna e na lista de clientes. É uma versão estática para os dados manuais: funciona no Go Live local e no GitHub Pages após o push, sem servidor de dados nem conexão com Facebook, Meta ou Hotmart. O relatório anterior de Operação continua disponível no endereço próprio.

Os seis exports mensais enviados de agosto, setembro e outubro de 2026 foram importados para um [pacote de dados criptografados](assets/reports/manual-analytics.enc.json). O acesso usa somente o login e a senha existentes do administrador. O segredo que abre os dados fica dentro do envelope criptografado dessa conta e é recuperado após o login; não há tela de chave extra nem segredo aberto no código. Sessões antigas precisam de um novo login para receber essa configuração. Os arquivos originais, dados pessoais e identificadores de transação não são publicados.

O painel mostra Mvave BR de 21/08 a 04/11/2026 e sinaliza que a Oficina do Violão ainda não tem exports. Meta tem gasto, impressões e compras diários; Hotmart tem transações diárias. Alcance consolidado, frequência agregada e atribuição Hotmart por anúncio permanecem indisponíveis. Funil e ROAS Meta são preservados nos períodos completos dos exports detalhados anteriores, de agosto a outubro. BRL e USD permanecem separados. Os totais de meses diferentes são somados em centavos; taxas são calculadas a partir dos totais.

Para reimportar após receber novos pares de arquivos `Meta (Rótulo).xlsx` e `Hotmart (Rótulo).xls`, execute a partir da raiz. O rótulo deve começar com o mês; para uma semana de novembro, por exemplo, use `Novembro 01-07` nos dois nomes. Os períodos internos dos arquivos precisam coincidir e não podem se sobrepor.

```powershell
Read-Host 'Chave de dados' | & .\.tools\node-v22.23.4-win-x64\node.exe scripts/import-manual-analytics.mjs 'C:\caminho\dos\exports' assets/reports/manual-analytics.enc.json
```

O comando lê a chave pela entrada padrão; ela não entra na linha de comando nem no Git. Para criar uma chave nova, acrescente `--new-key` e guarde a chave exibida. Uma chave nova invalida a anterior para o pacote recém-gerado e exige atualizar o vínculo do administrador com `scripts/link-analytics-login.mjs` (senha e chave via JSON na entrada padrão). Não rotacione a chave durante uma importação comum. Confira os totais e faça o push somente do pacote criptografado e do código. Para novembro, prefira exports **semanais** de ambas as plataformas, com datas iguais e sem sobreposição; isso equilibra acompanhamento e trabalho manual. Uma conferência diária de gasto e vendas pode orientar ajustes, enquanto o fechamento mensal é uma consolidação das semanas.

### Atualização manual dos insights

O relatório inclui os novos exports de Hotmart (inclusive status de reembolso), séries diárias dos três arquivos do Instagram e o retrato de público sem data de referência. Os valores diários de seguidores são novos seguidores, conforme confirmado pelo responsável; seguidores, visualizações e interações são somados no período selecionado e aparecem na visão geral. Tracking das vendas é definido como compras Meta ÷ vendas aprovadas Hotmart × 100, no mesmo período e moeda. Identificadores SCK numéricos foram classificados sem publicar os códigos; o cruzamento com anúncios depende dos IDs da Meta. Os exports Meta atualizados incluem cliques, visitas à página de destino, checkouts, compras e valor de conversão, preenchendo funil e ROAS Meta. Os IDs vieram arredondados em notação científica no XLSX e não são usados para atribuir vendas Hotmart por anúncio. A biblioteca apresenta 264 prévias das duas marcas. Os cards dos anúncios usam também 28 prévias das peças originais vinculadas por código/nome a 48 anúncios; versões históricas podem diferir.

Para atualizar Hotmart, Instagram e os arquivos Meta detalhados, use `scripts/update-manual-insights.mjs <pasta> assets/reports/manual-analytics.enc.json` e forneça a chave interna pela entrada padrão. O script valida os períodos, elimina dados pessoais e recusa mudanças em totais aprovados que exigem reconciliação. Depois, execute `scripts/link-manual-creatives.mjs <repositorio-mvave> assets/reports/manual-analytics.enc.json` com a chave interna via stdin para regenerar os vínculos e as prévias; o repositório de origem é somente lido.

### Interface original e seguidores

O acesso permanece em `clientes/analytics/index.html`. A página carrega o bundle já compilado de `assets/analytics-runtime/dashboard.js`, portanto Go Live e GitHub Pages não precisam executar Node. Depois de alterar os componentes React, regenere o bundle:

```sh
cd analytics
npm ci
npm run build:manual
```

Na aba **Instagram**, informe perfil, data e seguidores. O mesmo perfil/data substitui o registro anterior. Os complementos ficam criptografados no armazenamento local deste navegador, com o segredo interno recuperado pelo login. **Baixar registros** gera uma cópia criptografada; **Restaurar registros** permite levá-la para outro navegador. Esses registros não são enviados automaticamente pelo push. Você também pode informar as contagens e datas para incorporá-las a uma atualização futura do relatório.

Os gráficos diários usam os novos exports diários sem rateio. Detalhes mensais históricos substituem os dias correspondentes apenas nos recortes completos, sem dupla contagem. Cliques, visitas à página de destino, checkouts e valor de conversão vêm dos novos exports Meta. As prévias dos criativos são vinculadas por código do material no repositório. O destaque inicial usa ROAS Meta quando o valor de conversão está disponível; MER continua no seletor. Referências anônimas e agrupamentos por nome não representam IDs originais de transações ou anúncios.

## Analytics automático — aplicação independente (não ativada)

A aplicação que forneceu o layout está em [`analytics/`](analytics/README.md). Ela mantém o site público e os relatórios manuais existentes intactos. Inclui demonstração identificada, dashboard Next.js, acesso Supabase com MFA/RLS, webhook Hotmart e rotinas de sincronização no servidor. **As conexões reais e os agendamentos ainda precisam ser configurados e validados; não estão ativos.** A versão manual compila os próprios componentes React `Dashboard`, `HistoryChart`, `CreativeGallery` e `InstagramPanel` da aplicação automática, com os mesmos estilos, ícones e interações. O adaptador estático desativa chamadas de API e substitui somente os recursos de servidor do Next.

Veja a [auditoria](analytics/docs/AUDITORIA.md), as [instruções de execução e implantação](analytics/README.md) e a [matriz de validação](analytics/docs/VALIDACAO.md). Não publicar essa aplicação no GitHub Pages: preparar um deploy separado com raiz `analytics`. Nenhum acesso à conta pessoal do Facebook ou alteração do repositório Mvave BR faz parte desta implementação.

## Oficina do Violão e visão Operação

`clientes/oficina-do-violao/index.html` usa a logo oficial já presente em `assets/images/brands/oficina-do-violao.png` e a mesma estrutura de relatório da Mvave BR. A conta Mvave BR abre os dois relatórios individuais, pois as duas marcas pertencem ao mesmo negócio. Enquanto não houver exports da Oficina, a página mostra um aviso de preparação, sem números inventados.

`clientes/operacao/index.html` mantém o relatório semanal anterior. O código de consolidação semanal permanece em `assets/scripts/operation-report.js` para preservar os relatórios individuais e permitir uma futura importação da Oficina. O Analytics manual usa os novos agregados mensais da Mvave BR e informa que a Oficina permanece pendente.

Para importar uma semana da Oficina, use `scripts/import-traffic-week.mjs <Ads.xlsx> <Hotmart.xls> <semana-temporaria.json>` com um caminho temporário fora do repositório. O importador aceita os formatos Meta detalhado e resumido e os dois formatos Hotmart já usados na Mvave. Ele valida período, status, moeda, transações, produtos e totais, e grava apenas agregados. Depois use `scripts/seal-oficina-report.mjs <semana-temporaria.json>` e forneça pela entrada padrão a senha existente da conta Mvave BR ou do administrador. O script criptografa o relatório próprio da Oficina com a chave já usada por essas contas, preserva os envelopes de acesso e acrescenta novas semanas sem duplicar períodos ou arquivos. Os exports originais, o JSON temporário e a senha não devem ser versionados.

`deno test scripts/check-operation-report.mjs scripts/check-traffic-metrics.mjs` verifica as somas, a separação de moedas, os campos ausentes, a cobertura parcial e os cálculos existentes.

## Dashboard piloto de tráfego · Mvave BR

`clientes/mvave-br/index.html` aplica o visual da demonstração aos dados reais de Meta Ads e Hotmart. A entrada por usuário e senha fica em `area-cliente.html`; `area-interna.html` é a entrada do administrador e a tela inicial de ferramentas; o botão Tráfego abre a seleção de clientes em `clientes/index.html`. O menu público distingue Área do Cliente e Área Interna. Os usuários configurados são **Mvave Br** e **Felipe Figueroa**, com a senha solicitada pelo responsável. As senhas não são gravadas em texto no código. O master abre Mvave BR, Oficina do Violão, Operação e o perfil existente de Victor Lopes; o acesso anterior do Victor continua funcionando.

O relatório oferece oito períodos de 21/08 a 11/10/2026, acumulado, lucro após mídia, gasto, ROAS geral e valor bruto em destaque; calendário para escolher a semana por data, evolução semanal, composição do bruto, produtos, funil Meta, receita diária, anúncios ordenáveis, histórico selecionável, CSV e impressão/PDF. Os valores são importados manualmente, sem conexão automática com as plataformas.

### Critérios de cálculo

- Valores monetários calculados em centavos. Lucro após mídia = líquido Hotmart em BRL − todo o gasto Meta. Não inclui honorários, tributos da empresa ou demais custos.
- ROAS geral = bruto Hotmart em BRL ÷ gasto Meta, abrangendo todas as origens. ROAS Meta usa exclusivamente o valor de conversão do export Meta. Não há junção ou atribuição individual entre vendas e anúncios.
- Nove transações recebidas em USD aparecem separadas; não existe conversão USD/BRL nos arquivos. Os resultados em BRL dos períodos afetados são parciais.
- Hotmart: status Completo e Aprovado; agrupamento pela data da transação; validação de duplicidades, moedas e datas. No formato de 14–20/09, bruto vem de Preço do Produto, líquido de Faturamento líquido; Preço Total pode conter parcelamento. Nas demais semanas, bruto e líquido vêm das colunas homônimas em moeda de recebimento.
- Primeiro período tem três dias; os demais, sete. Variações monetárias usam médias por dia. ROAS, ticket e CPA acumulados usam os totais correspondentes, nunca médias das taxas.
- Não são estimados alcance, impressões, CTR ou gasto diário sem série completa nos exports. O Meta de 05–11/10 traz gasto e compras, mas não cliques, visitas, checkouts ou valor de conversão; as métricas dependentes ficam indisponíveis nessa semana e no acumulado. Anúncios são agrupados por nome, pois os identificadores vieram em notação científica. Compras Meta e transações Hotmart são exibidas separadamente.

### Atualização e reutilização

`scripts/import-mvave.py <pasta-dos-exports> <json-temporario-fora-do-repo>` lê os 12 arquivos originais XLSX/OOXML (inclusive os Hotmart com extensão `.xls`), valida os registros e gera somente agregados. As semanas de 28/09 a 04/10 e 05 a 11/10 foram adicionadas com `scripts/import-mvave-week.mjs` e `scripts/append-mvave-week.mjs`, mantendo os envelopes de acesso e a chave do relatório. Os 16 arquivos de origem têm nomes, quantidades de registros e SHA-256 no pacote agregado para rastreabilidade. Esquemas, moedas ou status novos devem ser revisados, não convertidos silenciosamente.

Para recriar o pacote do zero, invoque `sealReport({input, root, accounts})` de `scripts/seal-traffic-report.mjs` em uma sessão privada de Node. Cada conta informa `id`, `username`, `password` e `role` (`client` ou `master`). A rotina gera o pacote criptografado e os envelopes de acesso. Para acrescentar uma semana com `append-mvave-week.mjs`, use a senha de uma conta existente; a rotina mantém a chave e os envelopes de acesso. Nunca salve senhas ou o JSON aberto no repositório.

O modelo visual fica em `assets/styles/traffic-dashboard.css`; renderização e cálculos ficam separados em `traffic-dashboard.js` e `traffic-metrics.js`. Para outro cliente, reutilize o modelo e o esquema de agregados, criando seu importador, página, pacote e contas próprios; revise moedas, custos e atribuição conforme o negócio. O importador Python é específico dos seis períodos originais da Mvave.

### Limites do acesso piloto

O projeto continua estático, compatível com GitHub Pages. Os novos dados agregados são criptografados com AES-256-GCM e as chaves de acesso derivadas com PBKDF2-SHA256 (600 mil iterações, salt aleatório). A chave aberta fica apenas em sessionStorage por até oito horas; sair limpa a sessão. Não são publicados os exports nem dados pessoais dos compradores.

Isso **não equivale a autenticação e autorização em servidor**. Uma senha de quatro dígitos permite tentativas offline; o cliente pode inspecionar ou modificar a interface, e permissões de navegação não são uma fronteira de segurança. O perfil legado do Victor ainda usa sua proteção simples anterior. Para produção com isolamento real entre clientes, migrar autenticação, autorização e dados para backend, com senhas individuais. Nenhuma publicação é realizada por esses scripts.

### Verificação do piloto

`node --test scripts/check-traffic-metrics.mjs` verifica lucro, separação de moedas, taxas ponderadas, agrupamento, denominadores zero e prejuízo. O piloto também foi conferido no navegador em 320, 390, 768, 1024 e 1440 px, com login, alternância dos períodos, ordenação, seleção pelo histórico, CSV e master. Use a prévia HTTP local descrita abaixo; Web Crypto requer localhost ou HTTPS.

Site estático em HTML, CSS e JavaScript, pronto para GitHub Pages. A reformulação mantém a identidade preta e laranja e concentra a oferta em **Sites** e **Tráfego Pago**.

## Páginas

- `index.html`: Hero da Marketing Figueroa com o gradiente laranja original, composição de design e estratégia, logos oficiais dos projetos e Thainá Sampaio em destaque no portfólio.
- `sites.html`: portfólio, processo, dois planos e perguntas frequentes.
- `trafego-pago.html`: apresentação da gestão, mockups desktop/mobile e acesso ao relatório pelo site ou pela versão instalada na tela inicial.
- `proposta-trafego.html`: proposta **não listada**, acessível pelo endereço direto. Facebook Ads por **R$ 1.100/mês**, uma reunião mensal e relatórios semanais pelo site ou pela versão instalada na tela inicial. Não recebe links nas páginas públicas e usa `noindex, nofollow`. Isso evita listagem; não constitui controle de acesso.
- `demonstracao-relatorio.html`: relatório responsivo da Spark Filmes com duas semanas de **dados fictícios**, gráfico, campanhas e análise. Não está conectado a uma conta de anúncios.
- `area-interna.html`: login do administrador existente, início com Tráfego e espaço para novas ferramentas. Adicione novos links ao grid de ferramentas dessa página.
- `area-cliente.html`: entrada por usuário e senha do piloto, com busca dos perfis anteriores preservada.

## Conteúdo comercial a conferir

- Os planos de sites são **Landing Page ou Página de Vendas: R$ 900 à vista ou 12x de R$ 90** e **Site Institucional: R$ 1.500 à vista ou 12x de R$ 150**. Os totais parcelados são R$ 1.080 e R$ 1.800. Necessidades fora do escopo são orçadas separadamente.
- **O WhatsApp ainda é o exemplo herdado do site anterior: `5511999999999`.** Substituir esse número nos links de `index.html`, `sites.html`, `trafego-pago.html`, `proposta-trafego.html` e `area-cliente.html` antes de publicar.
- Os R$ 1.100/mês são honorários de gestão. A verba de mídia é adicional e paga diretamente à plataforma.

## Identidade e arquivos

- `assets/styles/marketing.css`: estilos das páginas públicas, com apresentações de serviços verticais e centralizadas em desktop e mobile.
- `assets/images/brands/`: logos oficiais copiadas dos repositórios locais; a origem de cada arquivo e a assinatura tipográfica da Dra. Patrícia estão documentadas no README dessa pasta.
- `styles.css` e `assets/styles/client-login.css`: layout laranja da entrada, com os campos de usuário e senha. O dashboard usa `report-demo.css` e `traffic-dashboard.css`.
- `script.js`: navegação mobile, teclado, ano e animações legadas.
- `assets/styles/report-demo.css` e `assets/scripts/report-demo.js`: relatório demonstrativo e seus dados.
- `assets/images/projects/`: capturas reais dos cinco sites, versão mobile da Thainá e capturas do relatório. Os dispositivos são compostos em HTML/CSS, sem distorcer os sites.
- `assets/images/mkt-logo-compact.svg`: logo oficial com a área vazia externa recortada pelo viewBox, usada no portal. A logo Mvave BR vem de `assets/images/brands/mvave.png`.
- `assets/images/favicon.svg`, `assets/images/favicon-16.png`, `assets/images/favicon-32.png`, `apple-touch-icon.png` e `assets/images/app-icon-*.png`: símbolo oficial laranja sobre fundo branco para navegador e tela inicial. Os PNGs pequenos são alternativas para navegadores sem suporte ao favicon SVG. `scripts/render-brand-icons.mjs` regenera os tamanhos a partir do SVG; o manifesto também define fundo branco para a abertura do aplicativo.
- `manifest.webmanifest`: permite abrir a área interna em modo de aplicativo a partir da tela inicial; os relatórios continuam online e exigem acesso à área do cliente.

Capturas dos sites realizadas em 2 de outubro de 2026. Fontes:

- https://thainasampaio.com.br
- https://borrachasrocha.com.br
- https://drapatriciaabreu.com.br
- https://dosim.com.br
- https://sparkfilmes.com.br

O escopo de tráfego foi redigido especificamente para a oferta informada, consultando referências públicas de [gestão de mídia da V4 Company](https://lp.v4company.com/assessoria/midia) e [gestão de tráfego da Webcompany](https://webcompany.com.br/servicos/trafego-pago/): planejamento, testes, otimização, análise e separação entre gestão e investimento em mídia. Não foram adotadas promessas de desempenho ou condições comerciais dessas empresas.

No iPhone, abra `area-cliente.html` no Safari e use **Compartilhar → Adicionar à Tela de Início**. O ícone instalado abre a área interna; os relatórios dependem de conexão.

## Prévia e verificação

Nenhum build ou instalação de dependências é necessário para servir o site:

```sh
python3 -m http.server 4173 --bind 127.0.0.1
```

Abrir `http://127.0.0.1:4173`. Para recapturar os sites ou verificar a reformulação, os scripts usam Deno, Playwright e o Chrome instalado no macOS:

```sh
deno run -A scripts/capture-sites.mjs
deno run -A scripts/preview-check.mjs
```

O primeiro script acessa os cinco sites públicos. O segundo requer o servidor local, atualiza as imagens do relatório e verifica seis páginas em larguras de 1440, 1024, 768, 390 e 320 px, incluindo imagens, transbordamento horizontal, menu, FAQ, alternância dos dados, links, página não listada e busca da área interna. Prévias ficam em `/private/tmp/figueroa-*.png`.

## Publicar no GitHub Pages

Após conferir os valores e atualizar o WhatsApp, envie os arquivos para a branch usada pelo GitHub Pages. Em **Settings → Pages**, use a raiz do repositório. `CNAME` mantém o domínio `marketingfigueroa.com.br`; `.nojekyll` permite servir os arquivos estáticos diretamente.

### Verificar a Área Interna

Com a prévia HTTP em `http://127.0.0.1:4173/`, execute `deno run -A scripts/check-internal-area.mjs`. O teste usa envelopes criptografados temporários, sem as senhas reais, para conferir login, restrição de perfil, atalhos, logout, menus e layout responsivo. Requer Google Chrome no caminho configurado no script.
