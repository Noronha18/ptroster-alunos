# PTRoster — Portal do Aluno

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

Alunos de personal trainer, principalmente adultos de 18 a 40 anos, que usam o app durante o treino, em pé, com as mãos ocupadas e em um ambiente barulhento. A atenção do aluno está nos exercícios e nos pesos, não na tela.

## Product Purpose

O PTRoster permite que o aluno consulte o treino criado pelo personal, registre séries e cargas, faça check-in de presença e acompanhe sua evolução. O produto é bem-sucedido quando essas tarefas podem ser concluídas rapidamente durante o treino e os registros permanecem sincronizados com o sistema usado pelo personal.

## Positioning

Portal móvel conectado à rotina do personal trainer: o aluno executa e registra diretamente o treino que recebeu, sem precisar montar fichas, criar uma conta por conta própria ou usar ferramentas separadas para treino e presença.

## Operating Context

- Uso prioritário em celulares e como PWA instalada.
- Interações realizadas durante o exercício, frequentemente com pouca atenção disponível e apenas uma mão livre.
- Ambiente de academia com ruído, movimento e possíveis reflexos na tela.
- Credenciais criadas pelo personal; o aluno não realiza autocadastro.
- O treino prescrito pelo personal é a referência para exercícios, séries, repetições e cargas.

## Capabilities and Constraints

- Login com credenciais fornecidas pelo personal.
- Consulta ao treino atual e aos exercícios prescritos.
- Registro de séries concluídas e cargas utilizadas.
- Check-in de presença associado ao plano ou a uma atividade livre.
- Histórico de sessões e acompanhamento de evolução.
- Interface mobile-first, leve e instalável como PWA.
- Frontend React integrado a uma API FastAPI e ao banco PostgreSQL já existente.
- A URL da API deve permanecer configurável por ambiente.
- Dados sensíveis não devem ser armazenados localmente além do necessário para autenticação.

## Brand Commitments

- Nome do produto: PTRoster.
- Voz motivacional, direta e focada, sem floreios.
- A experiência deve transmitir energia de treino sem recorrer a gamificação excessiva.
- O lima "volt" `#C8FF2E` representa progresso, conclusão e vitória.
- Tema escuro grafite com o lima como único acento de marca (decisão de 2026-11-13, substitui o verde neon `#00FF7F`). Tokens em `src/index.css` e `src/themes/ptroster/ptrosterTheme.ts`. Cores semânticas de erro e alerta devem ser diferenciadas de acentos decorativos.
- Evitar aparência clínica, dashboards densos e distrações que disputem atenção com o treino.

## Evidence on Hand

- Aplicação React funcional em `src/` com fluxos de login, dashboard, treinos, check-in, histórico e perfil.
- Integração existente com a API do PTRoster.
- Ativo visual principal em `src/assets/hero.png`.
- Ícones e manifesto da PWA em `public/`.
- Não há depoimentos, pesquisas com alunos ou métricas de uso documentadas; trabalhos futuros não devem inventar esse tipo de evidência.

## Product Principles

- Cada toque deve contar: as ações centrais devem exigir o mínimo de etapas possível.
- A interface serve ao treino e desaparece quando não é necessária.
- Informações essenciais devem permanecer legíveis à distância de um braço e sob atenção reduzida.
- Toda ação importante precisa apresentar feedback imediato e deixar claro se foi salva.
- O aluno deve perceber seu progresso ao longo da sessão e entre sessões.

## Accessibility & Inclusion

- Controles devem ser confortáveis para toque e utilizáveis com uma mão.
- Texto, estados e feedback não podem depender apenas de cor ou de animação.
- A experiência deve respeitar preferências de redução de movimento, navegação por teclado e tecnologias assistivas.
- A interface deve continuar utilizável com aumento de texto e em telas móveis estreitas.
