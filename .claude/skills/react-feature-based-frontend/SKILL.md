---
name: react-feature-based-frontend
description: Cria (do zero) ou expande um frontend React + TypeScript com Vite, Tailwind CSS, MUI (Material UI), Zustand, arquitetura feature-based e um BaseService de CRUD genérico consumido via Axios, além de Docker/Nginx para produção. Use quando o usuário pedir para criar/gerar/bootstrapar um novo projeto frontend React, adicionar uma nova feature/módulo seguindo esse padrão, criar um service de CRUD para um recurso, ou configurar deploy com Nginx/Docker para um projeto React.
---

# React Feature-Based Frontend

Skill para gerar (ou expandir) um frontend **React 18 + TypeScript** com **Vite**, **Tailwind
CSS**, **MUI (Material UI)**, **Zustand**, organizado por **feature**, com um **service global de
CRUD** (Axios) que cada feature estende, e deploy via **Docker + Nginx**.

Esta skill é a versão React das skills irmãs `vue-feature-based-frontend` e
`angular-feature-based-frontend` — mesma arquitetura e convenções, adaptadas para as ferramentas
mais idiomáticas do ecossistema React (Zustand no lugar de Pinia/Signals, MUI no lugar de
Vuetify/Angular Material, react-router-dom no lugar do Vue Router/Angular Router).

Todos os arquivos prontos para copiar estão em `templates/`, com a mesma estrutura de pastas que o
projeto final deve ter. Prefira **copiar e adaptar** esses arquivos a escrever do zero.

## Quando usar esta skill

- "cria um projeto React com MUI/Tailwind"
- "monta o frontend React seguindo arquitetura feature-based"
- "cria uma feature de `<recurso>` com CRUD em React"
- "adiciona um service para `<recurso>` que bate na API" (em projeto React)
- "configura Nginx/Docker para esse projeto React"
- "cria tela de login e página principal em React"

## Passo 0 — Perguntas rápidas (só se não estiver claro)

Se o usuário não tiver dito, pergunte objetivamente (ou assuma o default indicado):

1. Nome do projeto/pasta (default: `frontend`).
2. URL base da API (default: `http://localhost:3000/api`, vai para `.env`).
3. Se é projeto **novo** (scaffold completo) ou **feature nova** em projeto existente que já segue
   este padrão (só copia a pasta da feature).

Não pergunte sobre TypeScript/Tailwind/MUI/Zustand/Axios/Nginx — isso já é a base fixa desta
skill.

---

## Caminho A — Projeto novo (scaffold completo)

1. **Criar o projeto base:**

   ```bash
   npm create vite@latest <nome-projeto> -- --template react-ts
   cd <nome-projeto>
   ```

2. **Copiar os arquivos de `templates/`** para a raiz do projeto recém-criado, **sobrescrevendo**
   os que o `create vite` já gerou (`package.json`, `vite.config.ts`, `tsconfig*.json`,
   `index.html`, `src/main.tsx`). Copie a árvore inteira de `templates/src/` e todos os arquivos
   de configuração na raiz de `templates/` (incluindo os que começam com `.`, como `.env.example`,
   `.gitignore`, `.editorconfig`, `.dockerignore`, `.vscode/`, `.husky/`).

   ```bash
   cp -r templates/. <nome-projeto>/
   rm -rf <nome-projeto>/src/App.tsx <nome-projeto>/src/App.css <nome-projeto>/src/assets/react.svg 2>/dev/null
   ```

   (O roteamento raiz já vem pronto em `templates/src/router/AppRouter.tsx`, então não precisa de
   um `App.tsx` separado — `main.tsx` já renderiza `<AppRouter />` direto.)

3. **Substituir os placeholders** nos arquivos copiados:
   - `__PROJECT_NAME__` → nome do projeto (em `package.json`, `docker-compose.yml`)
   - `__APP_NAME__` → nome de exibição (em `index.html`)

4. **Instalar dependências** (o `package.json` do template já lista todas: react-router-dom,
   zustand, @mui/material, @mui/icons-material, @emotion/react, @emotion/styled, @fontsource/roboto,
   axios, tailwindcss, eslint, prettier, husky, lint-staged, vitest, etc.):

   ```bash
   npm install
   ```

5. **Criar o `.env`** a partir do `.env.example` e ajustar `VITE_API_BASE_URL` com o valor que o
   usuário informou (ou o default).

6. **Ativar o husky** (hooks de git — só faz sentido se o projeto for um repo git):

   ```bash
   git init -q 2>/dev/null; npx husky init 2>/dev/null || true
   ```

7. **Rodar `npm run dev`** para validar que sobe sem erro, e reportar ao usuário a URL local.

8. Explicar ao usuário, em poucas linhas: onde fica o login (`/login`), a página principal (`/`),
   como criar uma nova feature (Caminho B abaixo) e como subir com Docker (`docker compose up --build`).

### O que cada arquivo de `templates/` faz

| Arquivo/pasta | Papel |
|---|---|
| `vite.config.ts` | Alias `@/` para `src/`, plugin do React (Fast Refresh) |
| `tailwind.config.ts` | Tema customizado (`brand.*`, `fontFamily`, `spacing`...) e `preflight: false` para não colidir com o `<CssBaseline />` do MUI — **este é o arquivo de configurações personalizadas do Tailwind pedido** |
| `src/theme/theme.ts` | Tema único do MUI, cores alinhadas às do Tailwind |
| `src/lib/http.ts` | Instância única do Axios: injeta Bearer token, trata 401 (logout automático), normaliza erros |
| `src/services/BaseService.ts` | **Service global de CRUD**: `getAll`, `getById`, `create`, `update`, `replace`, `delete` — genérico, para qualquer entidade |
| `src/router/AppRouter.tsx` | Rotas raiz |
| `src/router/ProtectedRoute.tsx` / `GuestRoute.tsx` | Guardas de rota (redirecionam pra `/login` ou pra `/`) |
| `src/features/auth/` | Feature de login: service próprio (não é CRUD), store Zustand, página |
| `src/features/users/` | Feature de exemplo com CRUD completo — **service que estende o BaseService** |
| `src/features/home/` | Página principal pós-login |
| `src/layouts/AuthLayout.tsx` | Layout da tela de login (sem AppBar/Drawer) |
| `src/layouts/DefaultLayout.tsx` | Layout da página principal (AppBar + Drawer do MUI) |
| `src/hooks/useCrud.ts` | Hook opcional para telas simples que não precisam de store dedicada |
| `Dockerfile`, `nginx.conf`, `docker-compose.yml` | Build multi-stage e serve estático com Nginx (SPA fallback, cache, healthcheck) |

---

## Caminho B — Adicionar uma feature nova em projeto existente

Use quando o projeto já segue esta arquitetura e o usuário pede uma feature nova (ex: "products",
"orders", "invoices"). Copie o padrão de `templates/src/features/users/`, adaptando o nome:

1. Criar a pasta `src/features/<feature>/` com subpastas `types/`, `services/`, `store/`, `pages/`,
   `components/` (o que for necessário).

2. **`types/<entidade>.ts`** — interface estendendo `BaseEntity` (de `@/types/api`), mais os tipos
   de payload de create/update. Copie `templates/src/features/users/types/user.ts` como modelo.

3. **`services/<entidade>Service.ts`** — classe que **estende `BaseService`**, passando o endpoint
   do recurso no `constructor`. Copie `templates/src/features/users/services/userService.ts` como
   modelo:

   ```ts
   class ProductService extends BaseService<Product, CreateProductPayload, UpdateProductPayload> {
     constructor() { super('/products') }
   }
   export const productService = new ProductService()
   ```

   Métodos que não são CRUD padrão (ex: `duplicate`, `archive`) entram como métodos extras nessa
   classe, usando `this.http` e `this.resource`.

   Se a feature **não for um recurso CRUD** (ex: um fluxo de checkout, um wizard), **não** estenda
   o `BaseService` — escreva um service próprio usando `http` diretamente, como
   `templates/src/features/auth/services/authService.ts`.

4. **`store/<entidade>Store.ts`** — store Zustand (`create<...>()((set, get) => ({...}))`) com
   `items`, `loading`, `error` e actions que chamam o service. Copie
   `templates/src/features/users/store/userStore.ts` como modelo.

5. **`pages/<Entidade>ListPage.tsx`** — listagem com `Table` do MUI + classes utilitárias do
   Tailwind para espaçamento (`p-4`, `flex`, `gap-*`). Copie
   `templates/src/features/users/pages/UsersListPage.tsx` como modelo. Se precisar de formulário
   de criação/edição, copie também `templates/src/features/users/components/UserFormDialog.tsx`
   (usa `Dialog` do MUI).

6. **Registrar a rota** em `src/router/AppRouter.tsx`, dentro do bloco `<Route element={<ProtectedRoute />}>`
   (a menos que a feature seja pública).

7. Se a feature aparecer na navegação principal, adicionar um item em `navItems` de
   `src/layouts/DefaultLayout.tsx`.

---

## Convenções importantes (sempre seguir)

- **Import absoluto**: sempre `@/features/...`, `@/services/...` — nunca caminho relativo longo
  (`../../../`). O alias `@` já está configurado em `vite.config.ts` e `tsconfig.app.json`.
- **Um service por recurso**, sempre em `features/<feature>/services/`. Nunca chamar `axios`
  diretamente de dentro de um componente `.tsx` — sempre passar por um service.
- **Tailwind é para layout/espaçamento/tipografia utilitária**; **MUI é para os componentes de UI**
  (botões, cards, inputs, tabelas, dialogs). Evitar recriar em Tailwind o que o MUI já oferece
  pronto.
- **Toda rota protegida** entra dentro do bloco `<Route element={<ProtectedRoute />}>` em
  `AppRouter.tsx` — a guarda já cuida do redirect para `/login`.
- **Nunca guardar token fora do fluxo já existente** (`localStorage.getItem/setItem('auth_token')`
  em `src/lib/http.ts` e `src/features/auth/store/authStore.ts`) — outros pontos do app não devem
  duplicar essa lógica. Repare que o `authStore` **não** usa o middleware `persist` do Zustand de
  propósito: ele gerencia a mesma chave `auth_token` que o interceptor do Axios lê, pra não ter
  duas fontes de verdade.
- **Stores Zustand são só estado + ações** — nada de lógica de UI dentro delas; componentes leem
  com `useXStore((state) => state.algumaCoisa)` (seletor), não `useXStore()` inteiro, pra evitar
  re-render desnecessário.

---

## Diferenças em relação às versões Vue e Angular desta skill

| Vue | Angular | React (esta skill) |
|---|---|---|
| Pinia | Signals | Zustand |
| Vuetify | Angular Material | MUI (Material UI) |
| Axios (`services/http.ts`) | `HttpClient` + interceptors | Axios (`lib/http.ts`) — igual ao Vue |
| Vue Router (`router.beforeEach`) | `CanActivateFn` (guards por rota) | react-router-dom (`ProtectedRoute`/`GuestRoute` como rotas wrapper) |
| `.env` / `import.meta.env` | `environment.ts` / `environment.prod.ts` | `.env` / `import.meta.env` — igual ao Vue |
| Vitest | Karma + Jasmine | Vitest — igual ao Vue |
| `<script setup>` (SFC) | Standalone components (classes + decorators) | Componentes funcionais + hooks |

---

## O que foi adicionado além do pedido original (e por quê)

Pedido: mesma coisa das versões Vue/Angular, mas para React — Tailwind + Nginx, biblioteca de UI
(MUI), state management (Zustand), arquivo de config custom do Tailwind, arquitetura feature-based,
service global de CRUD + services de feature herdando dele, layouts de login/página principal.
Além disso, esta skill inclui:

1. **react-router-dom com rotas-guarda** (`ProtectedRoute`/`GuestRoute`) — necessário para separar
   login da página principal, com redirecionamento automático.
2. **Axios centralizado com interceptors** (`src/lib/http.ts`) — injeta o token em toda requisição
   e trata `401` (logout automático), em vez de cada service cuidar disso sozinho.
3. **Store de autenticação (Zustand)** persistindo o token em `localStorage` — mantém o usuário
   logado entre refreshes da página.
4. **Alias de import `@/`** configurado em Vite + TypeScript — evita imports relativos longos.
5. **ESLint + Prettier** (+ `prettier-plugin-tailwindcss`) — padronização de código.
6. **Husky + lint-staged** — roda lint/format automaticamente no commit.
7. **Vitest com um teste de exemplo** para o `BaseService` — base de testes unitários pronta para
   expandir.
8. **Tema único do MUI** (`src/theme/theme.ts`) alinhado às cores do Tailwind, em vez de usar o
   tema default do MUI.
9. **Docker multi-stage completo** (`Dockerfile` + `docker-compose.yml` + `.dockerignore`), não só
   o `nginx.conf` — para build e deploy reproduzíveis com um único comando.
10. **`nginx.conf` com fallback de SPA, cache de assets, gzip, healthcheck e headers de segurança**
    básicos.
11. **Feature de exemplo `users`** com CRUD completo (list + create + edit + delete via `Dialog`) —
    demonstra na prática o padrão "service herda BaseService" pedido.
12. **`useCrud` hook** — alternativa mais leve a uma store Zustand para telas simples.
13. **`.vscode/extensions.json`** com as extensões recomendadas (ESLint, Prettier, Tailwind
    IntelliSense).
14. **`.env.example`** e tipagem de `import.meta.env` (`vite-env.d.ts`).
15. **README.md** do projeto explicando a estrutura e os comandos.

### Recomendações que **não** foram implementadas (fica a critério do usuário pedir depois)

- **React Query / TanStack Query**, se o app precisar de cache/revalidação de dados de servidor
  mais sofisticado que o padrão `store.fetchAll()` incluso aqui.
- **react-hook-form + zod**, se os formulários crescerem em complexidade (o `LoginPage` e o
  `UserFormDialog` inclusos usam estado simples do React, suficiente para o escopo desta skill).
- **i18n** (`react-i18next`), se o app precisar de múltiplos idiomas.
- **Sentry** ou similar para monitoramento de erros em produção.
- **Testes E2E** (Playwright/Cypress) além dos testes unitários já incluídos.
- **CI** (GitHub Actions) rodando lint/test/build a cada push.
- **Dark mode toggle** — o tema do MUI (`src/theme/theme.ts`) pode virar dois temas (`light`/`dark`)
  com um `ThemeProvider` condicional; não incluído por padrão para manter o escopo enxuto.
