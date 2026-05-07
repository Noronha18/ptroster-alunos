# 🧠 Contexto do Projeto — PTROSTER (Interface do Aluno PWA)

## 👤 Sobre o Desenvolvedor e o Produto
- **Perfil Técnico:** Desenvolvedor Fullstack. Backend FastAPI (com JWT) e Frontend em React 19.
- **Visão de Produto:** App do **Aluno**, 100% mobile-first, leve e instalável (PWA).
- **Regra de Negócio de Acesso:** O aluno NÃO cria conta. As credenciais são geradas no painel admin. O aluno faz login para acessar treinos e check-ins.

---

## 🛠️ Stack do Frontend (PWA do Aluno)

| Camada | Tecnologia |
|---|---|
| Framework UI | React 19 (via Vite) |
| Estilização | Tailwind CSS (Mobile-First) |
| Roteamento | React Router DOM |
| PWA | vite-plugin-pwa |
| Cliente HTTP | Axios (integrado ao backend FastAPI) |
| Autenticação | JWT em localStorage |

---

## 🎯 Funcionalidades Principais (MVP)
1. **Login:** CPF/Usuário e Senha.
2. **Dashboard:** Treino do dia e status de presença.
3. **Treinos:** Listagem detalhada de exercícios (séries/repetições/carga).
4. **Check-in:** Botão de confirmação de presença (POST para API).

---

## 📐 Princípios de Desenvolvimento
- **Instalável (PWA):** O app deve funcionar como um ícone na tela do celular sem passar pelas lojas.
- **Performance:** Consumo eficiente da API FastAPI existente.
- **Mobile-First Real:** Focado em telas pequenas, botões grandes e navegação intuitiva.

---

## 🗄️ Integração com Backend
- **Banco de Dados:** Reutiliza o PostgreSQL existente via API FastAPI. **Não é necessário um novo DB.**
- **API URL:** `http://localhost:8000` (configurável via `.env`).

---

## 🎓 Modo de Aprendizado

Quando sugerir qualquer implementação no código React ou Tailwind, seguir este padrão didático:

1. **Conceito** 🎓 — explique o padrão do React (ex: um hook customizado) ou a classe do Tailwind.
2. **Implementação** ✅ — código React limpo, componentizado, com tipagem ou PropTypes.
3. **Visão de Produto** ⚠️ — como essa tela/componente ajuda o aluno na hora do treino ou reduz o trabalho do personal.
4. **Trade-offs** 🔄 — o que ganhamos e perdemos com essa abordagem no Frontend.

---

## 🚫 Anti-Padrões — Nunca Fazer

- ❌ Lógica de negócio dentro de componentes de UI — extrair para hooks customizados
- ❌ Chamadas Axios diretas nos componentes — centralizar em um módulo `services/`
- ❌ Armazenar dados sensíveis além do JWT no localStorage
- ❌ Componentes gigantes com múltiplas responsabilidades — dividir por função
- ❌ Estilos inline — usar classes Tailwind
- ❌ Hardcodar a URL da API — sempre usar variável de ambiente

---

## 📁 Estrutura de Pastas Sugerida

```
src/
├── main.jsx                  # Entry point
├── App.jsx                   # Rotas principais
├── components/
│   └── {componente}.jsx      # Componentes reutilizáveis (Button, Card...)
├── pages/
│   ├── Login.jsx             # Tela de login
│   ├── Dashboard.jsx         # Treino do dia + status
│   ├── Treinos.jsx           # Listagem de exercícios
│   └── Checkin.jsx           # Confirmação de presença
├── hooks/
│   └── use{Nome}.js          # Hooks customizados (useAuth, useTreino...)
├── services/
│   └── api.js                # Instância do Axios + interceptors JWT
└── utils/
    └── auth.js               # Funções de token (get, set, remove)
```

---

## 🤖 Instruções para o Claude Code

- **Sempre leia os arquivos relevantes** antes de propor qualquer código ou alteração
- **Nunca assuma** o conteúdo de um arquivo sem lê-lo primeiro
- **Mostre o diff** antes de aplicar qualquer mudança em arquivo existente
- **Pergunte antes** de instalar novas dependências ou criar arquivos fora da estrutura padrão
- **Respeite o escopo** — não refatore código que não foi pedido
- **Uma coisa por vez** — se a tarefa for grande, quebre em etapas e confirme cada uma
- **Mobile-first sempre** — qualquer componente novo deve ser pensado primeiro para telas pequenas

<!-- rtk-instructions v2 -->
# RTK (Rust Token Killer) - Token-Optimized Commands

## Golden Rule

**Always prefix commands with `rtk`**. If RTK has a dedicated filter, it uses it. If not, it passes through unchanged. This means RTK is always safe to use.

**Important**: Even in command chains with `&&`, use `rtk`:
```bash
# ❌ Wrong
git add . && git commit -m "msg" && git push

# ✅ Correct
rtk git add . && rtk git commit -m "msg" && rtk git push
```

## RTK Commands by Workflow

### Build & Compile (80-90% savings)
```bash
rtk cargo build         # Cargo build output
rtk cargo check         # Cargo check output
rtk cargo clippy        # Clippy warnings grouped by file (80%)
rtk tsc                 # TypeScript errors grouped by file/code (83%)
rtk lint                # ESLint/Biome violations grouped (84%)
rtk prettier --check    # Files needing format only (70%)
rtk next build          # Next.js build with route metrics (87%)
```

### Test (60-99% savings)
```bash
rtk cargo test          # Cargo test failures only (90%)
rtk go test             # Go test failures only (90%)
rtk jest                # Jest failures only (99.5%)
rtk vitest              # Vitest failures only (99.5%)
rtk playwright test     # Playwright failures only (94%)
rtk pytest              # Python test failures only (90%)
rtk rake test           # Ruby test failures only (90%)
rtk rspec               # RSpec test failures only (60%)
rtk test <cmd>          # Generic test wrapper - failures only
```

### Git (59-80% savings)
```bash
rtk git status          # Compact status
rtk git log             # Compact log (works with all git flags)
rtk git diff            # Compact diff (80%)
rtk git show            # Compact show (80%)
rtk git add             # Ultra-compact confirmations (59%)
rtk git commit          # Ultra-compact confirmations (59%)
rtk git push            # Ultra-compact confirmations
rtk git pull            # Ultra-compact confirmations
rtk git branch          # Compact branch list
rtk git fetch           # Compact fetch
rtk git stash           # Compact stash
rtk git worktree        # Compact worktree
```

Note: Git passthrough works for ALL subcommands, even those not explicitly listed.

### GitHub (26-87% savings)
```bash
rtk gh pr view <num>    # Compact PR view (87%)
rtk gh pr checks        # Compact PR checks (79%)
rtk gh run list         # Compact workflow runs (82%)
rtk gh issue list       # Compact issue list (80%)
rtk gh api              # Compact API responses (26%)
```

### JavaScript/TypeScript Tooling (70-90% savings)
```bash
rtk pnpm list           # Compact dependency tree (70%)
rtk pnpm outdated       # Compact outdated packages (80%)
rtk pnpm install        # Compact install output (90%)
rtk npm run <script>    # Compact npm script output
rtk npx <cmd>           # Compact npx command output
rtk prisma              # Prisma without ASCII art (88%)
```

### Files & Search (60-75% savings)
```bash
rtk ls <path>           # Tree format, compact (65%)
rtk read <file>         # Code reading with filtering (60%)
rtk grep <pattern>      # Search grouped by file (75%)
rtk find <pattern>      # Find grouped by directory (70%)
```

### Analysis & Debug (70-90% savings)
```bash
rtk err <cmd>           # Filter errors only from any command
rtk log <file>          # Deduplicated logs with counts
rtk json <file>         # JSON structure without values
rtk deps                # Dependency overview
rtk env                 # Environment variables compact
rtk summary <cmd>       # Smart summary of command output
rtk diff                # Ultra-compact diffs
```

### Infrastructure (85% savings)
```bash
rtk docker ps           # Compact container list
rtk docker images       # Compact image list
rtk docker logs <c>     # Deduplicated logs
rtk kubectl get         # Compact resource list
rtk kubectl logs        # Deduplicated pod logs
```

### Network (65-70% savings)
```bash
rtk curl <url>          # Compact HTTP responses (70%)
rtk wget <url>          # Compact download output (65%)
```

### Meta Commands
```bash
rtk gain                # View token savings statistics
rtk gain --history      # View command history with savings
rtk discover            # Analyze Claude Code sessions for missed RTK usage
rtk proxy <cmd>         # Run command without filtering (for debugging)
rtk init                # Add RTK instructions to CLAUDE.md
rtk init --global       # Add RTK to ~/.claude/CLAUDE.md
```

## Token Savings Overview

| Category | Commands | Typical Savings |
|----------|----------|-----------------|
| Tests | vitest, playwright, cargo test | 90-99% |
| Build | next, tsc, lint, prettier | 70-87% |
| Git | status, log, diff, add, commit | 59-80% |
| GitHub | gh pr, gh run, gh issue | 26-87% |
| Package Managers | pnpm, npm, npx | 70-90% |
| Files | ls, read, grep, find | 60-75% |
| Infrastructure | docker, kubectl | 85% |
| Network | curl, wget | 65-70% |

Overall average: **60-90% token reduction** on common development operations.
<!-- /rtk-instructions -->