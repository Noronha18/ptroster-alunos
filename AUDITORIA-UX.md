# Auditoria do portal do aluno — 30/09/2026

## Escopo e evidências

Avaliação das seis rotas e componentes compartilhados, incluindo fluxos de carga, séries, descanso, presença e histórico. Evidências: leitura do código atual, detector Impeccable e cálculo de contraste WCAG com as cores declaradas. O detector retornou `[]`; isso não comprova acessibilidade nem qualidade visual.

Não houve navegador disponível no runtime (`No browser is available`; descoberta retornou `[]`). Portanto, screenshots, teclado em execução, zoom de 200%, overflow real, instalação móvel e métricas de desempenho permanecem pendentes. As observações de layout são hipóteses fundamentadas no CSS, e não resultados de inspeção renderizada. Nenhum dado real de aluno foi acessado.

## Integridade da implementação

Parcial: o tema escuro, verde de progresso, navegação inferior e agrupamento de exercícios expressam uma identidade consistente com o produto. Porém, persistência incompleta de séries, métricas potencialmente enganosas e feedback de erro insuficiente prejudicam a confiança. O detector não apresentou achados mecânicos; os problemas abaixo foram identificados por análise contextual.

| Dimensão | Nota provisória | Evidência principal |
|---|---:|---|
| Acessibilidade | 1/4 | Botões de série sem nome, contraste insuficiente e modal sem gestão de foco |
| Performance | 3/4 | Rotas divididas; requisições repetidas e timer baseado em decremento |
| Responsividade | 2/4 | Alvos pequenos e conteúdo sem limite de largura; renderização pendente |
| Theming | 2/4 | Tokens presentes, mas cores repetidas inline e acentos divergentes |
| Integridade | 2/4 | Registros locais descartados e métricas baseadas em amostra limitada |
| **Total** | **10/20** | **Aceitável, com trabalho significativo necessário** |

Notas são avaliação técnica provisória, não um resultado Lighthouse ou certificação WCAG. Total: 0 P0 comprovados, 10 P1 e 7 P2. Riscos condicionais de perda de carga exigem reprodução adicional.

## Achados prioritários

### 1. [P1] Séries concluídas desaparecem

Local: `src/pages/Treinos.jsx`, estado `doneSets` e efeito de `selectedIdx`. Categoria: integridade/UX.

As séries ficam exclusivamente em memória e são zeradas ao mudar de treino. Sair da rota também desmonta o componente. O aluno perde o acompanhamento da sessão ao consultar outra tela. Não existe envio dessas séries ao backend neste fluxo.

Recomendação: definir registro por aluno, sessão e treino; restaurar progresso ao retornar e sincronizar o registro de execução com a API. Diferenciar carga prescrita de carga executada quando o produto precisar de evolução histórica. Comando: `$impeccable harden`.

### 2. [P1] Autosave ainda tem janela de perda e concorrência

Local: `src/pages/Treinos.jsx`, `salvarCarga` e efeito de debounce. Categoria: integridade/UX.

O cleanup cancela o timer ao desmontar: navegação antes dos 700 ms pode descartar uma edição que não disparou blur. Valores diferentes podem gerar PATCH simultâneos; a deduplicação cobre apenas o mesmo valor. Respostas fora de ordem podem atualizar cache e servidor com a carga anterior. Essas condições estão demonstradas pela estrutura do código, mas não foram reproduzidas em navegador nesta auditoria.

Recomendação: serializar gravações por prescrição, manter o último valor pendente e guardar rascunho para recuperação. Testar navegação antes do debounce, rede lenta, respostas invertidas e retry. Fechamento abrupto não deve depender de concluir uma requisição de unload. Comando: `$impeccable harden`.

### 3. [P1] Falha no autosave pode apagar o valor e informar sucesso antigo

Local: `src/pages/Treinos.jsx`, efeito de sincronização e estados `salvo`/`salvando`. Categoria: integridade/UX.

Após falha, `salvando` volta a false. Se o campo já perdeu foco e a carga do servidor difere do ref, o efeito pode sobrescrever a edição. Além disso, um check de sucesso anterior permanece ativo durante uma nova edição, podendo reaparecer após falha. Não existe estado persistente de edição pendente ou botão de retry.

Recomendação: separar rascunho, valor confirmado e status; mostrar “Salvando”, “Salvo” ou “Não salvo — tentar novamente”; nunca substituir rascunho sujo por refetch. Comando: `$impeccable harden`.

### 4. [P1] Contraste insuficiente em informações e mensagens

Local: `src/pages/Treinos.jsx` (legendas `#555`), `src/pages/Login.jsx` (ajuda), `src/pages/Perfil.jsx` (meta `#444`), `src/components/Toast.jsx`. Categoria: acessibilidade/cores. WCAG 1.4.3.

Razões calculadas: `#555` sobre `#1A1A1A`: 2,33:1; sobre `#0D0D0D`: 2,61:1; `#444` sobre `#1A1A1A`: 1,79:1. Toast branco sobre verde: 1,35:1; sobre vermelho: 3,41:1. São inferiores a 4,5:1 para texto normal. Já `#888` sobre `#1A1A1A` alcança 4,91:1.

Recomendação: tokens de texto secundário legíveis e texto escuro nos toasts claros; manter distinção sem reduzir a legibilidade. Comando: `$impeccable colorize`.

### 5. [P1] Controles essenciais sem identificação acessível

Local: `src/pages/Treinos.jsx` (botão de série e input de carga), `src/pages/Login.jsx` (labels sem `htmlFor`/id), `src/pages/Checkin.jsx` (atividade “Outro”). Categoria: acessibilidade. WCAG 1.3.1, 3.3.2 e 4.1.2.

O botão de série desmarcada não tem texto nem nome acessível; o input de carga possui apenas placeholder. Labels de login não estão associados aos campos. Seleções de treino e atividade não expõem consistentemente o estado selecionado.

Recomendação: nomes como “Concluir série 2 de Supino”, labels associados, estados `aria-pressed` ou semântica de seleção apropriada. Comando: `$impeccable harden`.

### 6. [P1] Modal de conclusão não gerencia foco ou viewport

Local: `src/pages/Treinos.jsx`, `CompletionModal`. Categoria: acessibilidade/layout. WCAG 2.4.3 e 4.1.2.

Overlay absoluto relativo à página longa pode colocar a confirmação fora da região visível. Não há `dialog`, `aria-modal`, foco inicial, contenção/restauração de foco ou Escape; elementos de fundo continuam disponíveis para teclado.

Recomendação: dialog acessível ligado ao viewport, ações visíveis, foco controlado e retorno ao exercício. Verificar se confirmação inline pode reduzir a interrupção. Comando: `$impeccable harden`.

### 7. [P1] Erros de rede se confundem com ausência de registros

Local: `src/hooks/useSessoes.js`, catches de `buscarSessaoHoje` e `buscarHistorico`; `src/pages/Dashboard.jsx`. Categoria: UX/integridade.

Falha ao consultar presença mantém `null`; falha no histórico só escreve no console. O aluno pode receber “Nenhuma sessão” ou um CTA de check-in apesar de existir registro. Dashboard e perfil não aguardam todas as métricas e podem apresentar zeros temporários.

Recomendação: estados de erro distintos de vazio, retry e indicação de dados desatualizados; bloquear decisões dependentes de consulta inconclusiva. Comando: `$impeccable harden`.

### 8. [P1] Indicadores de evolução usam dados incompletos

Local: `src/hooks/useSessoes.js`, `limit: 30`; `src/pages/Historico.jsx` e `src/pages/Perfil.jsx`. Categoria: integridade/UX.

“Total” é o tamanho da lista de até 30 sessões. “Últimas 8 semanas”, totais mensais e sequência também são derivados dessa amostra, que pode não cobrir o período. “Esta semana” usa intervalos móveis de sete dias em vez de uma semana de calendário. A tela acompanha presença, mas não mostra evolução de cargas.

Recomendação: agregados ou consultas por período, paginação, datas explícitas no gráfico e rótulos que descrevam o dado real. Tratar evolução de cargas como escopo posterior com histórico de execução definido. Comando: `$impeccable clarify` e `$impeccable harden`.

### 9. [P1] Datas UTC divergem do dia local do aluno

Local: `src/hooks/useSessoes.js` (`toISOString`); funções de sequência e semana em Dashboard, Histórico e Perfil. Categoria: integridade/UX.

No Recife, após 21h o dia UTC já mudou. A consulta “hoje” pode usar o dia seguinte; as telas misturam data UTC, prefixo textual da API e data local. A consequência é presença ou sequência atribuída ao dia errado.

Recomendação: contrato explícito de timezone e utilitário único de calendário local. Testar 20h59, 21h01 e meia-noite com timestamps com offset. Comando: `$impeccable harden`.

### 10. [P1] Feedback não é anunciado e idioma do documento está incorreto

Local: `src/components/Toast.jsx`, erros em Login e loaders; `index.html` (`lang="en"`). Categoria: acessibilidade. WCAG 3.1.1 e 4.1.3.

Leitores de tela podem pronunciar português como inglês e não receber confirmação de carga/presença ou erros. Spinners isolados não explicam o que está carregando.

Recomendação: `lang="pt-BR"`, regiões de status/alerta apropriadas e textos de carregamento. Comando: `$impeccable harden`.

## Melhorias da próxima rodada

### 11. [P2] Alvos de toque pequenos

Local: `Treinos.jsx`, tabs (`py-1.5`) e Pular (`py-1.5`); Dashboard, “Ver todas”. Categoria: responsividade.

Altura prevista de aproximadamente 28–30 px nos primeiros controles, abaixo da recomendação ergonômica de 44 px para uso em academia. Isso não é automaticamente uma violação do mínimo WCAG 2.5.8 de 24 px; medir espaçamento e caixa real na etapa visual.

Recomendação: área clicável de pelo menos 44 px e separação confortável. Comando: `$impeccable adapt`.

### 12. [P2] Hierarquia pequena e excesso de indicadores

Local: Histórico (gráfico 9 px), Perfil e Dashboard (labels 10 px), Treinos (legendas 11 px). Categoria: layout/UX.

Informações exigem leitura próxima e atenção que o aluno não tem durante o exercício. Perfil repete contagem mensal em estatística, card e meta; saldo é apresentado como meta de progresso, embora diminuir saldo seja uso esperado.

Recomendação: ampliar informações operacionais, reduzir repetição e explicar saldo como disponibilidade. Priorizar próximo exercício, reps e carga. Comando: `$impeccable typeset` e `$impeccable distill`.

### 13. [P2] Layout de telas grandes e safe area incompletos

Local: `src/App.jsx`, páginas e BottomNav. Categoria: responsividade/layout.

Somente a navegação tem `max-w-lg`; conteúdo ocupa toda a largura em desktop/tablet. Reserva inferior fixa `pb-20` não incorpora explicitamente o inset usado pela navegação. `min-h-screen` em páginas, somado ao padding externo, pode causar scroll extra. Faltam capturas em 320/390/768/1440 px e com texto ampliado para confirmar impacto.

Recomendação: container coerente, espaçamento com safe area e altura dinâmica do viewport; testar teclado móvel e nomes longos. Comando: `$impeccable adapt` e `$impeccable layout`.

### 14. [P2] Cores e superfície instalada divergem da marca

Local: `src/index.css`, cores inline, avatares azul/verde; `index.html` e manifesto (`#a3ff00`). Categoria: theming.

O app usa `#00FF7F`, mas a barra instalada usa outro verde. Azul decorativo nos avatares e confete multicolorido divergem do único acento de marca registrado. Tokens duplicados `ios-*` e valores inline dificultam ajustes consistentes.

Recomendação: unificar tokens semânticos de superfície, texto, progresso e erro; preservar verde de marca e alinhar manifesto. Comando: `$impeccable colorize` e `$impeccable extract`.

### 15. [P2] Timer perde precisão e não respeita fluxo de grupos

Local: `Treinos.jsx`, efeito de `restSecs` e `toggleSet`. Categoria: UX/performance.

Decremento por callback pode atrasar quando celular bloqueia ou navegador limita timers. Toda série inicia descanso, inclusive exercícios agrupados cuja instrução diz descansar ao final. Essa contradição atrapalha bi-sets e circuitos.

Recomendação: tempo final absoluto, recálculo ao retornar e descanso conforme a sequência do grupo. Comando: `$impeccable harden`.

### 16. [P2] Entrada e continuidade exigem esforço desnecessário

Local: Login, Checkin (estado de sucesso), CompletionModal. Categoria: UX.

Login não oferece mostrar senha nem orientação específica para recuperar acesso. Após confirmar presença, não há ação direta “Ir para o treino”. A conclusão sempre oferece fazer check-in, mesmo que ele já tenha sido realizado antes.

Recomendação: ajuda de acesso ligada ao personal, mostrar senha com nome acessível e CTA contextual conforme presença. Comando: `$impeccable onboard` e `$impeccable clarify`.

### 17. [P2] Movimento e resiliência móvel precisam de revisão

Local: `src/index.css` (`0.01ms` global), `src/hooks/useSessoes.js`, `vite.config.js`. Categoria: acessibilidade/performance.

A redução global de duração encerra feedback animado sem alternativa específica. Hooks de sessão criam estados e buscas independentes por tela. Há manifesto, mas não há registro de service worker; funcionamento offline não está implementado. Installabilidade precisa ser testada nos dispositivos alvo, pois manifesto isolado não garante suporte uniforme.

Recomendação: redução de movimento por componente mantendo status legível, consultas compartilhadas e indicação offline/pendente. Comando: `$impeccable animate`, `$impeccable optimize` e `$impeccable harden`.

## Pontos positivos a preservar

- Identidade escura com verde de progresso e navegação inferior com texto e ícones.
- Botões de série com caixa de 44 × 44 px e `aria-pressed` já presente.
- Acordeões usam `aria-expanded` e `inert` para conteúdo fechado.
- Vídeos são montados apenas ao abrir o exercício; rotas usam carregamento separado.
- Cache oferece abertura rápida e atualização de carga sincroniza estado e armazenamento local após sucesso.
- Estados vazios de treino orientam procurar o personal, sem inventar conteúdo.

## Ordem recomendada

1. `$impeccable harden`: persistência, concorrência de carga, séries, erro de rede, timezone, nomes acessíveis e modal.
2. `$impeccable colorize`: corrigir contraste e consolidar cores da marca.
3. `$impeccable adapt`: áreas de toque, safe area, teclado móvel e texto ampliado.
4. `$impeccable clarify`: métricas honestas, status de salvamento e continuidade após check-in.
5. `$impeccable layout` / `$impeccable typeset` / `$impeccable distill`: hierarquia e leitura durante o treino.
6. `$impeccable optimize` / `$impeccable animate`: consultas, timers e redução de movimento.
7. `$impeccable polish`: acabamento após corrigir os problemas funcionais.

## Validação visual pendente

Executar capturas e interações em mobile estreito, mobile comum, tablet e desktop; zoom/texto de 200%; navegação de teclado e leitor de tela; teclado aberto; nomes/repetições longos; plano vazio; rede lenta/offline; múltiplas cargas sucessivas; sair e retornar ao treino. Não usar dados de produção para testes mutantes. Medir Core Web Vitals com ferramentas disponíveis na próxima sessão e repetir a auditoria após as correções.
