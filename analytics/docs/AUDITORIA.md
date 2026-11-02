# Auditoria — 2 de novembro de 2026

Escopo: exclusivamente o checkout `marketing-figueroa`. Nenhum acesso ao repositório Mvave BR, à sessão Facebook ou às credenciais do piloto.

## Estado encontrado

- HTML/CSS/JavaScript estáticos, sem package.json, build, backend ou banco.
- Publicação documentada via GitHub Pages, raiz do repositório; `CNAME`: marketingfigueroa.com.br. Não foi consultado nem alterado o ambiente remoto para confirmar o deploy ativo.
- Páginas comerciais, áreas interna/cliente e relatórios em `clientes/`.
- Relatórios Mvave BR/Oficina/Operação: importações manuais; agregados criptografados AES-GCM e envelopes PBKDF2. Isso não fornece autorização em servidor. Arquivos criptografados não foram abertos.
- Identidade: preto #0b0b0b, laranja #fc7306, Manrope, logotipo oficial em assets/images.
- Scripts existentes testam importações, métricas e interface; alguns dependem de Deno/Chrome em caminhos de macOS.
- Árvore de trabalho limpa no início. Nenhum AGENTS.md encontrado no checkout ou nos ancestrais consultados.

## Decisão

Aplicação independente `analytics/`, Next.js App Router + TypeScript, Supabase Auth/Postgres/Realtime e Recharts. CSS próprio para preservar identidade e reduzir dependências; Tailwind/shadcn não são necessários para esta primeira versão. Publicação futura separada na Vercel com Root Directory `analytics`, sem migrar GitHub Pages. Domínio administrativo deve ser configurado somente no lançamento.

Sincronização no servidor Next.js, acionada por Supabase Cron/pg_net com segredo no Vault. Um único runtime para validações, webhook e adaptadores facilita testes; Edge Functions não são necessárias nesta arquitetura. O cron funciona sem navegador aberto. RLS em todas as tabelas, MFA obrigatório para todos os leitores de dados, acesso administrativo pelo Supabase autenticado.

Demonstração isolada em `/demo`, com dados sintéticos rotulados. `/dashboard` nunca usa demo como fallback. Site público, relatórios e envelopes existentes preservados. Não criar links públicos ao Analytics nem publicar nesta etapa.

## Limites de validação

Integrações só poderão ser declaradas operacionais após configurar ambientes, executar migrations, cadastrar organizações/contas/membros e testar com APIs reais. Não importar automaticamente relatórios criptografados históricos, nem inferir IDs de anúncios a partir dos nomes usados no piloto.
