# Marketing Figueroa

Site estático em HTML, CSS e JavaScript, pronto para GitHub Pages. A reformulação mantém a identidade preta e laranja e concentra a oferta em **Sites** e **Tráfego Pago**.

## Páginas

- `index.html`: Hero da Marketing Figueroa com o gradiente laranja original, composição de design e estratégia, logos oficiais dos projetos e Thainá Sampaio em destaque no portfólio.
- `sites.html`: portfólio, processo, dois planos e perguntas frequentes.
- `trafego-pago.html`: apresentação da gestão, mockups desktop/mobile e acesso ao relatório pelo site ou pela versão instalada na tela inicial.
- `proposta-trafego.html`: proposta **não listada**, acessível pelo endereço direto. Facebook Ads por **R$ 1.100/mês**, uma reunião mensal e relatórios semanais pelo site ou pela versão instalada na tela inicial. Não recebe links nas páginas públicas e usa `noindex, nofollow`. Isso evita listagem; não constitui controle de acesso.
- `demonstracao-relatorio.html`: relatório responsivo da Spark Filmes com duas semanas de **dados fictícios**, gráfico, campanhas e análise. Não está conectado a uma conta de anúncios.
- `area-cliente.html`: busca da área interna existente; dados, relatórios e acesso de clientes foram preservados.

## Conteúdo comercial a conferir

- Os planos de sites são **Landing Page ou Página de Vendas: R$ 900 à vista ou 12x de R$ 90** e **Site Institucional: R$ 1.500 à vista ou 12x de R$ 150**. Os totais parcelados são R$ 1.080 e R$ 1.800. Necessidades fora do escopo são orçadas separadamente.
- **O WhatsApp ainda é o exemplo herdado do site anterior: `5511999999999`.** Substituir esse número nos links de `index.html`, `sites.html`, `trafego-pago.html`, `proposta-trafego.html` e `area-cliente.html` antes de publicar.
- Os R$ 1.100/mês são honorários de gestão. A verba de mídia é adicional e paga diretamente à plataforma.

## Identidade e arquivos

- `assets/styles/marketing.css`: estilos das páginas públicas, com apresentações de serviços verticais e centralizadas em desktop e mobile.
- `assets/images/brands/`: logos oficiais copiadas dos repositórios locais; a origem de cada arquivo e a assinatura tipográfica da Dra. Patrícia estão documentadas no README dessa pasta.
- `styles.css`: estilos existentes da área de cliente, preservados.
- `script.js`: navegação mobile, teclado, ano e animações legadas.
- `assets/styles/report-demo.css` e `assets/scripts/report-demo.js`: relatório demonstrativo e seus dados.
- `assets/images/projects/`: capturas reais dos cinco sites, versão mobile da Thainá e capturas do relatório. Os dispositivos são compostos em HTML/CSS, sem distorcer os sites.
- `assets/images/favicon.svg`, `assets/images/favicon-16.png`, `assets/images/favicon-32.png`, `apple-touch-icon.png` e `assets/images/app-icon-*.png`: símbolo oficial da logo adaptado aos ícones do navegador e da tela inicial. Os PNGs pequenos são alternativas para navegadores sem suporte ao favicon SVG.
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
