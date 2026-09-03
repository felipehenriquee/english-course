---
name: vue-feature-based-frontend
description: Cria (do zero) ou expande um frontend Vue 3 + TypeScript com Vite, Tailwind CSS, Vuetify, Pinia, arquitetura feature-based e um BaseService de CRUD genérico consumido via Axios, além de Docker/Nginx para produção. Use quando o usuário pedir para criar/gerar/bootstrapar um novo projeto frontend Vue, adicionar uma nova feature/módulo seguindo esse padrão, criar um service de CRUD para um recurso, ou configurar deploy com Nginx/Docker para um projeto Vue.
---

# Vue Feature-Based Frontend

Skill para gerar (ou expandir) um frontend **Vue 3 + TypeScript** com **Vite**, **Tailwind CSS**,
**Vuetify**, **Pinia**, organizado por **feature**, com um **service global de CRUD** (Axios) que
cada feature estende, e deploy via **Docker + Nginx**.

Todos os arquivos prontos para copiar estão em `templates/`, com a mesma estrutura de pastas que
o projeto final deve ter. Prefira **copiar e adaptar** esses arquivos a escrever do zero — eles já
contêm os padrões de import, tipagem e comentários explicando o "porquê" de cada decisão.

## Quando usar esta skill

- "cria um projeto Vue com Vuetify/Tailwind/Pinia"
- "monta o frontend seguindo arquitetura feature-based"
- "cria uma feature de `<recurso>` com CRUD"
- "adiciona um service para `<recurso>` que bate na API"
- "configura Nginx/Docker para esse projeto Vue"
- "cria tela de login e página principal em Vue"

## Passo 0 — Perguntas rápidas (só se não estiver claro)

Se o usuário não tiver dito, pergunte objetivamente (ou assuma o default indicado):

1. Nome do projeto/pasta (default: `frontend`).
2. URL base da API (default: `http://localhost:3000/api`, vai para `.env`).
3. Se é projeto **novo** (scaffold completo) ou **feature nova** em projeto existente que já segue
   este padrão (só copia a pasta da feature).

Não pergunte sobre TypeScript/Tailwind/Vuetify/Pinia/Nginx — isso já é a base fixa desta skill.

---

## Caminho A — Projeto novo (scaffold completo)

1. **Criar o projeto base:**

   ```bash
   npm create vite@latest <nome-projeto> -- --template vue-ts
   cd <nome-projeto>
   ```

2. **Copiar os arquivos de `templates/`** para a raiz do projeto recém-criado, **sobrescrevendo**
   os que o `create vite` já gerou (`package.json`, `vite.config.ts`, `tsconfig*.json`,
   `index.html`, `src/main.ts`, `src/App.vue`). Copie a árvore inteira de `templates/src/` e todos
   os arquivos de configuração na raiz de `templates/` (incluindo os que começam com `.`, como
   `.env.example`, `.gitignore`, `.editorconfig`, `.dockerignore`, `.vscode/`, `.husky/`).

   ```bash
   cp -r templates/. <nome-projeto>/
   rm -rf <nome-projeto>/src/components/HelloWorld.vue <nome-projeto>/src/assets/vue.svg 2>/dev/null
   ```

3. **Substituir os placeholders** nos arquivos copiados:
   - `__PROJECT_NAME__` → nome do projeto (em `package.json`, `docker-compose.yml`)
   - `__APP_NAME__` → nome de exibição (em `index.html`)

4. **Instalar dependências** (o `package.json` do template já lista todas: vue-router, pinia,
   pinia-plugin-persistedstate, vuetify, @mdi/font, axios, tailwindcss, eslint, prettier, husky,
   lint-staged, vitest, etc.):

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
| `vite.config.ts` | Alias `@/` para `src/`, plugin do Vuetify (tree-shaking) |
| `tailwind.config.ts` | Tema customizado (`brand.*`, `fontFamily`, `spacing`...) e `preflight: false` para não colidir com o reset do Vuetify — **este é o arquivo de configurações personalizadas do Tailwind pedido** |
| `postcss.config.js` | Pipeline do Tailwind + autoprefixer |
| `src/plugins/vuetify.ts` | Instância única do Vuetify, tema claro/escuro alinhado às cores do Tailwind |
| `src/plugins/pinia.ts` | Instância do Pinia + plugin de persistência (localStorage) |
| `src/router/index.ts` | Rotas + guarda global de autenticação (`requiresAuth`) |
| `src/services/http.ts` | Instância única do Axios: injeta Bearer token, trata 401 (logout automático), normaliza erros |
| `src/services/BaseService.ts` | **Service global de CRUD**: `getAll`, `getById`, `create`, `update`, `replace`, `delete` — genérico, para qualquer entidade |
| `src/features/auth/` | Feature de login: service próprio (não é CRUD), store Pinia, view |
| `src/features/users/` | Feature de exemplo com CRUD completo — **service que estende o BaseService** |
| `src/features/home/` | Página principal pós-login |
| `src/layouts/AuthLayout.vue` | Layout da tela de login (sem AppBar/Drawer) |
| `src/layouts/DefaultLayout.vue` | Layout da página principal (AppBar + NavigationDrawer do Vuetify) |
| `src/composables/useCrud.ts` | Composable opcional para telas simples que não precisam de store dedicada |
| `Dockerfile`, `nginx.conf`, `docker-compose.yml` | Build multi-stage e serve estático com Nginx (SPA fallback, cache, healthcheck) |

---

## Caminho B — Adicionar uma feature nova em projeto existente

Use quando o projeto já segue esta arquitetura e o usuário pede uma feature nova (ex: "products",
"orders", "invoices"). Copie o padrão de `templates/src/features/users/`, adaptando o nome:

1. Criar a pasta `src/features/<feature>/` com subpastas `types/`, `services/`, `store/`, `views/`,
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

4. **`store/<entidade>Store.ts`** — store Pinia (Composition API, `defineStore('<nome>', () => {...})`)
   com `items`, `loading`, `error` e actions que chamam o service. Copie
   `templates/src/features/users/store/userStore.ts` como modelo.

5. **`views/<Entidade>ListView.vue`** — listagem com `v-data-table` do Vuetify + classes utilitárias
   do Tailwind para espaçamento (`p-4`, `flex`, `gap-*`). Copie
   `templates/src/features/users/views/UsersListView.vue` como modelo. Se precisar de formulário de
   criação/edição, copie também `templates/src/features/users/components/UserFormDialog.vue`.

6. **Registrar a rota** em `src/router/index.ts`, dentro do bloco de rotas com
   `meta: { requiresAuth: true }` (a menos que a feature seja pública).

7. Se a feature aparecer na navegação principal, adicionar um item em `navItems` de
   `src/layouts/DefaultLayout.vue`.

---

## Convenções importantes (sempre seguir)

- **Import absoluto**: sempre `@/features/...`, `@/services/...` — nunca caminho relativo longo
  (`../../../`). O alias `@` já está configurado em `vite.config.ts` e `tsconfig.app.json`.
- **Um service por recurso**, sempre em `features/<feature>/services/`. Nunca chamar `axios`
  diretamente de dentro de um componente `.vue` — sempre passar por um service.
- **Tailwind é para layout/espaçamento/tipografia utilitária**; **Vuetify é para os componentes de
  UI** (botões, cards, inputs, tabelas, dialogs). Evitar recriar em Tailwind o que o Vuetify já
  oferece pronto.
- **Toda rota protegida** precisa de `meta: { requiresAuth: true }` no `router/index.ts` — a guarda
  global já cuida do redirect para `/login`.
- **Nunca guardar token fora do fluxo já existente** (`localStorage.getItem/setItem('auth_token')`
  em `src/services/http.ts` e `src/features/auth/store/authStore.ts`) — outros pontos do app não
  devem duplicar essa lógica.

---

## O que foi adicionado além do pedido original (e por quê)

O usuário pediu: Vue + Vite + Tailwind + Nginx + Vuetify + Pinia, arquivo de config custom do
Tailwind, arquitetura feature-based, service global de CRUD + services de feature herdando dele, e
layouts de login/página principal. Além disso, esta skill inclui:

1. **Vue Router 4 com guarda de autenticação** — necessário para de fato ter uma tela de login
   separada da página principal, com redirecionamento automático.
2. **Axios centralizado com interceptors** (`src/services/http.ts`) — injeta o token em toda
   requisição e trata `401` (logout automático), em vez de cada service cuidar disso sozinho.
3. **Store de autenticação (Pinia) com persistência** (`pinia-plugin-persistedstate`) — mantém o
   usuário logado entre refreshes da página.
4. **Alias de import `@/`** configurado em Vite + TypeScript — evita imports relativos longos.
5. **ESLint + Prettier** (+ `prettier-plugin-tailwindcss` para ordenar classes) — padronização de
   código.
6. **Husky + lint-staged** — roda lint/format automaticamente no commit.
7. **Vitest + @vue/test-utils** com um teste de exemplo para o `BaseService` — base de testes
   unitários pronta para expandir.
8. **`vite-plugin-vuetify`** — importa só os componentes do Vuetify usados (bundle menor).
9. **Docker multi-stage completo** (`Dockerfile` + `docker-compose.yml` + `.dockerignore`), não só
   o `nginx.conf` — para build e deploy reproduzíveis com um único comando.
10. **`nginx.conf` com fallback de SPA, cache de assets, gzip, healthcheck e headers de segurança**
    básicos — não só o "serve estático".
11. **Feature de exemplo `users`** com CRUD completo (list + create + edit + delete via dialog) —
    demonstra na prática o padrão "service herda BaseService" pedido.
12. **`useCrud` composable** — alternativa mais leve a uma store Pinia para telas simples.
13. **`.vscode/extensions.json`** com as extensões recomendadas (Volar, ESLint, Prettier, Tailwind
    IntelliSense) — abre o VS Code já sugerindo o setup certo.
14. **`.env.example`** e tipagem de `import.meta.env` (`vite-env.d.ts`) — variáveis de ambiente
    tipadas em vez de string solta.
15. **README.md** do projeto explicando a estrutura e os comandos.

### Recomendações que **não** foram implementadas (fica a critério do usuário pedir depois)

- **i18n** (`vue-i18n`), se o app precisar de múltiplos idiomas.
- **Sentry** ou similar para monitoramento de erros em produção.
- **Testes E2E** (Playwright/Cypress) além dos testes unitários já incluídos.
- **CI** (GitHub Actions) rodando lint/test/build a cada push.
- **Dark mode toggle** — o tema `dark` já existe em `plugins/vuetify.ts`, falta só um botão que
  alterna `theme.global.name`.
