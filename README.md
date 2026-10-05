# Marketing Figueroa

## Dashboard piloto de tráfego · Mvave BR

`clientes/mvave-br/index.html` aplica o visual da demonstração aos dados reais de Meta Ads e Hotmart. A entrada por usuário e senha fica em `area-cliente.html`; `area-interna.html` é a entrada do administrador e a tela inicial de ferramentas; o botão Tráfego abre a seleção de clientes em `clientes/index.html`. O menu público distingue Área do Cliente e Área Interna. Os usuários configurados são **Mvave Br** e **Felipe Figueroa**, com a senha solicitada pelo responsável. As senhas não são gravadas em texto no código. O master abre Mvave BR e o perfil existente de Victor Lopes; o acesso anterior do Victor continua funcionando.

O relatório oferece sete períodos de 21/08 a 04/10/2026, acumulado, lucro após mídia, gasto, ROAS geral e valor bruto em destaque; calendário para escolher a semana por data, evolução semanal, composição do bruto, produtos, funil Meta, receita diária, anúncios ordenáveis, histórico selecionável, CSV e impressão/PDF. Os valores são importados manualmente, sem conexão automática com as plataformas.

### Critérios de cálculo

- Valores monetários calculados em centavos. Lucro após mídia = líquido Hotmart em BRL − todo o gasto Meta. Não inclui honorários, tributos da empresa ou demais custos.
- ROAS geral = bruto Hotmart em BRL ÷ gasto Meta, abrangendo todas as origens. ROAS Meta usa exclusivamente o valor de conversão do export Meta. Não há junção ou atribuição individual entre vendas e anúncios.
- Nove transações recebidas em USD aparecem separadas; não existe conversão USD/BRL nos arquivos. Os resultados em BRL dos períodos afetados são parciais.
- Hotmart: status Completo e Aprovado; agrupamento pela data da transação; validação de duplicidades, moedas e datas. No formato de 14–20/09, bruto vem de Preço do Produto, líquido de Faturamento líquido; Preço Total pode conter parcelamento. Nas demais semanas, bruto e líquido vêm das colunas homônimas em moeda de recebimento.
- Primeiro período tem três dias; os demais, sete. Variações monetárias usam médias por dia. ROAS, ticket e CPA acumulados usam os totais correspondentes, nunca médias das taxas.
- Não são estimados alcance, impressões, CTR ou gasto diário ausentes nos exports. Anúncios são agrupados por nome, pois os identificadores vieram em notação científica. Compras Meta e transações Hotmart são exibidas separadamente.

### Atualização e reutilização

`scripts/import-mvave.py <pasta-dos-exports> <json-temporario-fora-do-repo>` lê os 12 arquivos originais XLSX/OOXML (inclusive os Hotmart com extensão `.xls`), valida os registros e gera somente agregados. A semana de 28/09 a 04/10 foi adicionada com `scripts/import-mvave-week.mjs` e `scripts/append-mvave-week.mjs`, mantendo os envelopes de acesso e a chave do relatório. Os 14 arquivos de origem têm nomes, quantidades de registros e SHA-256 no pacote agregado para rastreabilidade. Esquemas, moedas ou status novos devem ser revisados, não convertidos silenciosamente.

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
