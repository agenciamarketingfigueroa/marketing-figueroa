# Validação da primeira implementação

Data: 2 de novembro de 2026. Ambiente local Windows, Node 22.23.4. Nenhuma credencial de Meta, Hotmart ou Supabase hospedado foi utilizada.

## Verificações concluídas

| Verificação | Resultado |
| --- | --- |
| ESLint (`npm run lint`) | Aprovado, sem erros ou avisos |
| TypeScript (`npm run typecheck`) | Aprovado |
| Vitest (`npm test`) | 54 testes aprovados, 6 arquivos |
| Next.js (`npm run build`) | Build de produção aprovado |
| HTTP local (`node scripts/http-smoke.mjs`) | Demo 200; nonce em todos os scripts; CSP/no-store; relatório, dashboard, cron Meta/Instagram, imagens privadas e webhook bloqueados sem configuração/autenticação |
| Testes legados | 11 aprovados: métricas, consolidação Operação e calendário |
| Dependências de produção (`npm audit --omit=dev`) | Nenhuma vulnerabilidade reportada |
| Escopo Git | Site público, scripts legados, relatórios e envelopes existentes intactos |

Os testes SQL executam as três migrations reais em PGlite (PostgreSQL em WASM), com schema Auth de teste, roles e claims simulados. Conferem RLS em todas as tabelas, AAL1/AAL2, duas organizações, negação de escrita/escalada e RPC privilegiada, duplicidade, conflito de IDs, eventos fora de ordem, rollback, lease, rate limit e substituição atômica da janela Meta.

Os testes de domínio conferem escala monetária/overflow, BRL/USD, status, origem ambígua, período anterior, meia-noite em São Paulo, cobertura incompleta, CSV e denominadores zero. Adaptadores são exercitados com fixtures e transporte simulado, incluindo autenticação inválida, retry, limite de corpo e erros de API. Logout e guardas de sessão são testados com SDK simulado.

Uma falha SQL de alias ambíguo foi detectada pelo teste de snapshot Meta, corrigida e verificada na suíte final. A aplicação não foi conectada a dados reais para encontrar esse erro.

Nesta ampliação foram testados também taxas do funil, acumulados com lacunas, ranking de criativos, início em 21/08/2026, histórico de seguidores sem estimativas, conta Instagram correta, escopo de produtos, URLs de imagem permitidas, RLS/MFA e leases das novas tabelas.

## Limitações da verificação

- **Navegador:** a prévia integrada informou `The browser access host is unavailable`. A tentativa de selecionar somente a janela Marketing Figueroa expirou com `Computer Use app approval timed out`. Não foi possível homologar aparência, interação ou responsividade em navegador. Não houve interação com a janela do Facebook.
- **Supabase hospedado:** migrations, Auth, convites, login/logout reais, TOTP real, Realtime e políticas em um projeto real ainda precisam de teste. Testes de mocks/SQL local não substituem isso.
- **Provedores:** Meta, Instagram e Hotmart não foram conectados. Paginação, permissões, payloads reais, totais, comissões, latência e quotas precisam de validação na operação.
- **Cron/deploy:** arquivos preparados, mas nada foi publicado ou agendado. Testar execução com navegador fechado após implantação.
- **Dependências de desenvolvimento:** a auditoria completa reportou 16 ocorrências moderadas transitivas ligadas a `minimatch` na cadeia do ESLint. O ESLint 9 também recebeu aviso de versão sem suporte. Não há alertas nas dependências de produção. Não foi aplicado `npm audit fix --force`, que sugeria downgrades incompatíveis. Atualizar a cadeia do linter de forma compatível e repetir a validação antes de aceitar entradas/globs externos não confiáveis.

## Critérios antes de produção

1. Homologar desktop e celular (320, 390, 768 e 1440 px), teclado, filtros, gráficos, tabela, CSV e menu móvel.
2. Validar Auth/MFA e isolamento com usuários reais de organizações distintas em ambiente de teste.
3. Enviar webhook oficial de teste, reenviar, simular aprovação e reembolso; conferir transação única, origem, moeda e ausência de PII.
4. Confirmar token de integração de leitura Meta, fuso da conta, versão da API, paginação e comparação com export oficial.
5. Confirmar semântica do total pago e do participante financeiro Hotmart; não liberar líquido por estimativa.
6. Executar jobs, interromper/repetir execução e verificar cursor, cobertura, rate limits, falhas e Realtime.
7. Configurar backups/restauração, monitoramento, retenção, segredos e WAF antes do lançamento.

Não considerar nenhuma integração operacional ou a aplicação homologada para produção antes dessas etapas.
