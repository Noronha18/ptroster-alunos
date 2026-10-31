# PTRoster — Portal do Aluno
 
PWA mobile-first em que alunos de personal trainer acompanham os treinos, registram as cargas e fazem check-in de presença, tudo pelo celular e durante o treino.
 
O app é o lado do **aluno** do ecossistema PTRoster. O personal trainer gera as credenciais no painel administrativo, então o aluno **não cria conta**: ele só faz login e já encontra o plano de treino prescrito.
 
> **Contexto de uso:** o aluno está em pé, com as mãos suadas, numa academia barulhenta. Por isso a interface tem tema escuro, botões grandes, texto legível com o braço estendido e no máximo dois toques por ação.
 
---
 
## Funcionalidades
 
| Tela | O que faz |
|---|---|
| **Login** | Autenticação com usuário/CPF e senha, que gera um JWT emitido pela API. |
| **Dashboard** | Saudação, treino do dia, status de presença de hoje e a sequência da semana. |
| **Treinos** | Lista os exercícios do plano ativo em acordeão, com séries, repetições e descanso. Também permite: <br>• marcar cada série como concluída <br>• registrar a **carga** (salva automaticamente ao sair do campo) <br>• ver o **vídeo de execução** (YouTube ou arquivo de vídeo) <br>• ver em destaque os **bi-sets, tri-sets e circuitos** |
| **Check-in** | Confirma a presença com o *plano prescrito* ou com uma *atividade livre* (corrida, funcional, outra). |
| **Histórico** | Sessões realizadas, frequência das últimas 8 semanas e totais. |
| **Perfil** | Saldo de aulas, treinos no mês, frequência semanal do plano e barras de meta. |
 
---
 
## Stack
 
| Camada | Tecnologia |
|---|---|
| UI | React 19 + Vite 8 |
| Estilo | Tailwind CSS 4 (`@tailwindcss/vite`) |
| Rotas | React Router DOM 7 (rotas carregadas sob demanda com `lazy` + `Suspense`) |
| HTTP | Axios com interceptors de JWT |
| Auth | JWT no `localStorage` com estado global via `AuthContext` |
| PWA | Web App Manifest (instalável na tela inicial, `display: standalone`) |
| Deploy | Render (site estático) |
| Backend | [PTRoster API](https://ptroster-app.onrender.com) em FastAPI + PostgreSQL (repositório separado) |
 
---
 
## Arquitetura
 
```
src/
├── main.jsx              # Entry point (Router + AuthProvider)
├── App.jsx               # Rotas, layout protegido e lazy loading
├── index.css             # Tema (tokens Tailwind), animações
├── contexts/
│   └── AuthContext.jsx   # Sessão, login/logout, dados do aluno + cache
├── hooks/
│   ├── useAluno.js       # Plano ativo e atualização de carga
│   ├── useSessoes.js     # Sessão do dia, histórico e check-in
│   └── useToast.js       # Feedback visual temporário
├── services/
│   └── api.js            # Instância Axios + interceptors (Bearer / 401)
├── utils/
│   └── auth.js           # Token, aluno_id e decode do JWT
├── components/           # BottomNav, Header, CardWorkout, ButtonPrimary, Toast
└── pages/                # Login, Dashboard, Treinos, Checkin, Historico, Perfil
```
 
**Decisões principais**
 
- **Lógica fora da UI:** as regras de negócio e as chamadas à API ficam em hooks e em `services/`. Os componentes cuidam só da apresentação.
- **Cache stale-while-revalidate:** os dados do aluno ficam no `localStorage`. Com cache, a tela abre na hora e é atualizada em segundo plano. Sem cache, aparece um spinner.
- **Carga persistida:** quando o aluno altera uma carga, o app envia um `PATCH` à API e atualiza a memória e o cache juntos. Assim o valor não volta ao antigo quando o app é reaberto.
- **Sessão expirada:** se a API responder `401` fora da rota de login, o app limpa a autenticação e manda o aluno para `/login`.
- **Code splitting:** `react`/`react-router` saem no chunk `vendor` e `axios` no chunk `http`, para cachear melhor entre deploys.
---
 
## Integração com a API
 
| Método | Endpoint | Uso |
|---|---|---|
| `POST` | `/auth/token` | Login (form-urlencoded). O JWT precisa trazer `aluno_id` |
| `GET` | `/alunos/me` (fallback `/alunos/{id}`) | Dados do aluno, planos, treinos e prescrições |
| `PATCH` | `/prescricoes/{id}/carga` | Atualiza a carga de um exercício |
| `GET` | `/sessoes/?aluno_id=&de=&ate=&realizada=` | Sessão do dia e histórico |
| `POST` | `/sessoes/` | Registra o check-in |
 
---
 
## Como rodar
 
**Pré-requisitos:** Node.js 20+ e a [API do PTRoster](https://ptroster-app.onrender.com) rodando (localmente em `http://localhost:8000`).
 
```bash
# 1. Clonar e instalar
git clone https://github.com/Noronha18/ptroster-alunos.git
cd ptroster-alunos
npm install
 
# 2. Configurar a URL da API (opcional, o padrão é http://localhost:8000)
echo "VITE_API_URL=http://localhost:8000" > .env.local
 
# 3. Subir em modo desenvolvimento
npm run dev
```
 
### Scripts
 
| Comando | Descrição |
|---|---|
| `npm run dev` | Servidor de desenvolvimento com HMR |
| `npm run build` | Build de produção em `dist/` |
| `npm run preview` | Serve o build localmente |
| `npm run lint` | ESLint |
 
### Variáveis de ambiente
 
| Variável | Descrição | Padrão |
|---|---|---|
| `VITE_API_URL` | URL base da API FastAPI | `http://localhost:8000` |
 
---
 
## Deploy
 
O deploy é feito no **Render** como site estático, configurado em [`render.yaml`](./render.yaml):
 
- Build: `npm ci && npm run build` → publica `./dist`
- Rewrite de `/*` para `/index.html` (SPA)
- `index.html` sem cache, para que cada deploy chegue logo aos alunos
- `VITE_API_URL` apontando para `https://ptroster-app.onrender.com`
---
 
## Identidade visual
 
O tema é escuro, com o neon verde **`#00FF7F`** como acento principal, reservado a progresso, conclusão e conquista. A identidade evita de propósito a estética de app clínico (branco e frio), as tabelas densas de dashboard analítico e a gamificação exagerada. Os princípios completos estão em [`PRODUCT.md`](./PRODUCT.md).
 
---
 
## Autor
 
Desenvolvido por **Emmanuel Noronha**, Eng. de Software Full-Stack e ex-instrutor de musculação.
