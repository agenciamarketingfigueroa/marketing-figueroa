# Central permanente MVAVE BR

As regras são as do `../AGENTS.md` e do Prompt Mestre preservado na raiz. Estratégia vigente: **PERFORMANCE + LAB em ABO; Método Del suspenso**. Recomendações nunca executam alterações nas plataformas.

## Atualização vigente

Veja `ATUALIZACAO_DIARIA_2026-11-09.md`: Gestor removido; Analytics com Relatórios e Ações do dia; export curto para WhatsApp/PDF; 395 arquivos diários importados, incluindo Instagram. A especificação de interface anterior foi substituída pelo pedido mais recente.

## O que está disponível

Atualização de 08/11: **Analytics → Relatórios** e **Painel → Relatório estratégico** incluem as onze seções, narrativas por criativo, histórico de propostas e projeções estatísticas. Consulte `RELATORIOS_ESTRATEGICOS.md` para regras, escopo, valores conferidos e limitações. A especificação recebida está em `PROMPT_EVOLUCAO_RELATORIOS.md`.

- `../clientes/analytics/` → **Ações do dia**: prioridades do último fechamento e somente criativos ativos no export.
- `../clientes/analytics/`: seleção por cliente, métricas, **Exportar PDF** (impressão → Salvar como PDF) e **Enviar pelo WhatsApp** (resumo pré-preenchido, destinatário e envio escolhidos pelo usuário). O PDF pode ser anexado manualmente à conversa.
- `../clientes/painel/`: seleção de cliente na apresentação. A seleção desmonta os dados do cliente anterior. Um cliente sem pacote mostra somente o estado vazio.
- `config/`: produtos confirmados, registro de criativos e estratégia.
- `dados/originais/`: cópias byte a byte nomeadas pelo SHA256, sem alteração dos arquivos recebidos.
- `dados/normalizados/base.json`: itens e mídia, identidades, origem/linha, SCK, datas e classificação; sem nomes/emails em texto. Os originais contêm dados pessoais: acesso local apenas.
- `dados/snapshots/`: versões anteriores, manifests, hashes e diferenças antes/depois, incluindo vendas tardias.
- `relatorios/diarios/`, `relatorios/semanais/` e `relatorios/consolidados/`: relatórios reproduzíveis, revisões preservadas. `status_atual.md` e `integridade.md` são o ponto de partida.
- `historico/`: decisões, mudanças de estratégia e pendências. Registrar ações reais somente quando confirmadas pelo responsável.

Dados e relatórios operacionais estão ignorados no Git e bloqueados no servidor local incluído. O site continua estático: os dados publicados ficam apenas em `assets/reports/manual-analytics.enc.json`, criptografados com a chave existente. Não publicar a pasta `dados`, nem servir todo o repositório com outro servidor que não aplique esses bloqueios.

## Importar e atualizar

Pré-requisitos: Node 22 e PowerShell para OOXML. Os arquivos `.xls` recebidos nesta atualização são OOXML, detectados pela assinatura, sem renomear. XLS binário BIFF usa o leitor `read-xls.py`: instalar **Python + xlrd==2.0.2** e configurar `MVAVE_PYTHON` com o executável. Esse caminho BIFF não foi validado nesta máquina, que não tem Python funcional. CSV UTF-8 aceita vírgula ou ponto e vírgula e campos entre aspas. Não converter IDs longos para número.

Crie um manifesto local, por exemplo `analise-mvave-br/dados/entrada.json`:

```json
{"files":[
  {"provider":"meta","path":"C:/exports/meta.xlsx","operation":"mvave-br","filters":"registrar filtros usados no export"},
  {"provider":"hotmart","path":"C:/exports/hotmart.xls","operation":"mvave-br"}
]}
```

Execute da raiz:

```powershell
# Apenas base local + relatórios, sem precisar de segredo
& .\.tools\node-v22.23.4-win-x64\node.exe analise-mvave-br/scripts/importar.mjs analise-mvave-br/dados/entrada.json

# Atualizar também o pacote usado pelo site, mantendo a chave atual (stdin)
Read-Host 'Chave de dados existente' | & .\.tools\node-v22.23.4-win-x64\node.exe analise-mvave-br/scripts/importar.mjs analise-mvave-br/dados/entrada.json --site
```

Use `node` no lugar do executável local quando disponível no PATH. A chave de dados é diferente da senha de login. Não registrar chave em manifestos, argumentos ou Git. O login do site permanece o mesmo. Não gerar nova chave em uma atualização comum.

Datas vêm das linhas internas, nunca do nome dos arquivos. Mesmos bytes não duplicam snapshots; transação + item substituem o estado anterior e preservam a revisão. Linhas antigas ausentes de um novo export Hotmart não são apagadas nem presumidas canceladas. Cancelamento exige linha explícita. Meta substitui a janela recebida; sobreposição parcial com agregado é recusada. Um relatório por conjunto/campanha é preservado localmente, mas não vira anúncio nem é rateado para o site. Enviar export diário por anúncio para atualizar o Analytics.

Na importação de pasta, exports Instagram vazios (somente `sep=,` ou cabeçalho válido sem linhas) são arquivados com hash e aviso, sem inferir data ou zero pelo nome. Cada métrica tem cobertura própria: se faltarem seguidores, visualizações e interações válidas continuam disponíveis. A auditoria registra as lacunas; reimportar um arquivo vazio não apaga valores existentes. O histórico normalizado do Instagram é preservado, com snapshot antes de cada gravação.

O manifesto identifica a operação Meta: só fornecer arquivos dessa operação. O importador é especializado na MVAVE BR. Para novos clientes, cadastrar política e fontes próprias após reunião; nunca reutilizar os filtros de produto MVAVE por semelhança. Produtos desconhecidos, moeda/país incompatíveis ou categoria não comprovada ficam `REVISAR`. Revisões de cadastro exigem reclassificação explícita, não apenas reenviar o mesmo hash.

## Próxima análise diária

1. Exportar Meta por **dia e anúncio**, incluindo ativos e pausados, nomes/IDs textuais de conta, campanha, conjunto e anúncio, gasto, orçamento, impressões, cliques, LPV, checkouts, compras e valor atribuído.
2. Exportar Hotmart incluindo status e revisões de dias anteriores, moeda, produto/ID, transação, data, bruto, líquido, SCK e vínculo de bump/upgrade. Registrar os filtros usados.
3. Executar a importação e revisar `status_atual.md`, integridade e snapshots. Conferir vendas tardias, cancelamentos e itens REVISAR antes das propostas.
4. Abrir Analytics → MVAVE BR → Relatórios (ou Relatório estratégico no Painel). Conferir comparação e janelas disponíveis, distinguindo observação, hipótese e proposta. Não fazer cortes por um único dia. O workspace Ações do dia substitui o Gestor.
5. Publicar código/bundle e pacote criptografado pelo fluxo habitual GitHub Pages. A execução local não faz push nem deploy. A atualização no navegador depende da publicação.
6. Registrar em `historico/decisoes.md` o que foi efetivamente decidido/feito pelo responsável.

Novas reuniões/clientes: `analytics/manual/operations.json` define nome, objetivo e cadência (`daily`/`weekly`). O envelope pode receber `clients[id]` com um `Dataset` próprio e cobertura própria. O seletor não compartilha dados MVAVE com clientes sem dataset. O perfil novo de 09/11 será criado depois da reunião, conforme solicitado. Ainda não há importador genérico de leads/agendamentos: o formato será definido conforme o negócio.

## Histórico e limitações

Preservado o histórico existente de 21/08 a 05/11/2026, incluindo **794 registros Hotmart de todos os status** e **4.666 linhas Meta**, além dos agregados históricos e Instagram. Isso não é uma nova validação de SCK: o pacote anterior é anonimizado. A auditoria desse legado está em `dados/normalizados/historico-existente.json`. Os únicos arquivos tabulares históricos rastreados encontrados no repositório pertencem a Victor Lopes e não foram misturados à MVAVE BR.

Importados nesta execução: 24 linhas Meta e 12 registros Hotmart de 06–07/11, sendo 11 itens aprovados (10 principais + 1 bump) e 1 pendente. BRL/Brasil. As 24 linhas Meta estão ativas; nenhum pausado aparece. IDs Meta vieram arredondados; sem atribuição SCK exata, sem nomes de campanhas/conjuntos, sem impressões e sem confirmação de filtros de anúncios pausados. Resultados são observados/parciais, não fechamento integral verificado. Nenhuma receita móvel de 30 dias foi reconstruída do texto do Prompt Mestre. A integridade das 77 datas do legado está em `relatorios/consolidados/integridade-legado.md`.

## Verificar

```powershell
node --test analise-mvave-br/testes/*.test.mjs scripts/check-manual-meta.mjs scripts/check-manual-daily-import.mjs
cd analytics
npm test
npm run typecheck
npm run build:manual
```

Testes cobrem centavos, bumps, sem SCK, IDs arredondados, granularidade de conjunto, vendas tardias, cancelamentos, duplicatas, operações/moedas e reimportação. O build gera `assets/analytics-runtime/dashboard.js` e `dashboard.css`. Não publicar somente TSX sem recompilar.
