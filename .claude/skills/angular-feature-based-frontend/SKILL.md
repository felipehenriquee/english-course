---
name: angular-feature-based-frontend
description: Cria (do zero) ou expande um frontend Angular (standalone components + Signals) com Angular CLI, Tailwind CSS, Angular Material, arquitetura feature-based e um BaseService de CRUD genérico consumido via HttpClient, além de Docker/Nginx para produção. Use quando o usuário pedir para criar/gerar/bootstrapar um novo projeto frontend Angular, adicionar uma nova feature/módulo seguindo esse padrão, criar um service de CRUD para um recurso, ou configurar deploy com Nginx/Docker para um projeto Angular.
---

# Angular Feature-Based Frontend

Skill para gerar (ou expandir) um frontend **Angular** (standalone components, sem NgModules) com
**Tailwind CSS**, **Angular Material**, estado global via **Signals**, organizado por **feature**,
com um **service global de CRUD** (`HttpClient`) que cada feature estende, e deploy via
**Docker + Nginx**.

Esta skill é a versão Angular da skill irmã `vue-feature-based-frontend` — mesma arquitetura e
convenções, adaptadas para as ferramentas nativas do Angular (Signals no lugar de Pinia, Angular
Material no lugar de Vuetify, HttpClient no lugar de Axios).

Todos os arquivos prontos para copiar estão em `templates/`, com a mesma estrutura de pastas que o
projeto final deve ter. Prefira **copiar e adaptar** esses arquivos a escrever do zero.

## Quando usar esta skill

- "cria um projeto Angular com Material/Tailwind"
- "monta o frontend Angular seguindo arquitetura feature-based"
- "cria uma feature de `<recurso>` com CRUD em Angular"
- "adiciona um service para `<recurso>` que bate na API" (em projeto Angular)
- "configura Nginx/Docker para esse projeto Angular"
- "cria tela de login e página principal em Angular"

## Passo 0 — Perguntas rápidas (só se não estiver claro)

Se o usuário não tiver dito, pergunte objetivamente (ou assuma o default indicado):

1. Nome do projeto/pasta (default: `frontend`).
2. URL base da API (default: `http://localhost:3000/api`, vai para `src/environments/environment.ts`).
3. Se é projeto **novo** (scaffold completo) ou **feature nova** em projeto existente que já segue
   este padrão (só copia a pasta da feature).

Não pergunte sobre Tailwind/Angular Material/Signals/Nginx — isso já é a base fixa desta skill.

---

## Caminho A — Projeto novo (scaffold completo)

1. **Criar o projeto base** com Angular CLI (standalone é o default desde o Angular 17+; SSR
   deve ser recusado, este template é SPA pura servida por Nginx):

   ```bash
   npx @angular/cli@19 new <nome-projeto> --style=css --routing=false --ssr=false --skip-git
   cd <nome-projeto>
   ```

   (`--routing=false` porque o roteamento já vem pronto em `templates/src/app/app.routes.ts`.)

2. **Copiar os arquivos de `templates/`** para a raiz do projeto, **sobrescrevendo** os que o
   `ng new` já gerou (`package.json`, `angular.json`, `tsconfig*.json`, `src/main.ts`,
   `src/index.html`, `src/styles.css`, `src/app/app.component.ts` e o `app.config.ts` gerado).
   Copie a árvore inteira de `templates/src/` e todos os arquivos de configuração na raiz de
   `templates/` (incluindo os que começam com `.`, como `.gitignore`, `.editorconfig`,
   `.dockerignore`, `.vscode/`, `.husky/`, `.postcssrc.json`).

   ```bash
   cp -r templates/. <nome-projeto>/
   rm -f <nome-projeto>/src/app/app.component.html <nome-projeto>/src/app/app.component.css \
         <nome-projeto>/src/app/app.component.spec.ts 2>/dev/null
   ```

3. **Substituir os placeholders** nos arquivos copiados:
   - `__PROJECT_NAME__` → nome do projeto, em **quatro lugares**: `package.json`,
     `angular.json` (chave do projeto + `outputPath`), `Dockerfile` (caminho
     `dist/__PROJECT_NAME__/browser`), `docker-compose.yml`.
   - `__APP_NAME__` → nome de exibição, em `src/index.html`.

4. **Instalar dependências** (o `package.json` do template já lista todas: Angular, Angular
   Material, CDK, Tailwind, ESLint/angular-eslint, Prettier, Husky, lint-staged):

   ```bash
   npm install
   ```

5. **Ajustar `src/environments/environment.ts`** com a `apiBaseUrl` que o usuário informou (ou o
   default), e `environment.prod.ts` com a URL de produção.

6. **Ativar o husky** (hooks de git — só faz sentido se o projeto for um repo git):

   ```bash
   git init -q 2>/dev/null; npx husky init 2>/dev/null || true
   ```

7. **Rodar `npm start`** para validar que sobe sem erro, e reportar ao usuário a URL local
   (`http://localhost:4200`).

8. Explicar ao usuário, em poucas linhas: onde fica o login (`/login`), a página principal (`/`),
   como criar uma nova feature (Caminho B abaixo) e como subir com Docker
   (`docker compose up --build`).

### O que cada arquivo/pasta de `templates/` faz

| Arquivo/pasta | Papel |
|---|---|
| `angular.json` | Config do Angular CLI (`application` builder = esbuild + Vite no dev-server, sem `vite.config.ts` exposto). Tailwind é detectado automaticamente pelo CLI a partir de `tailwind.config.ts` + `.postcssrc.json` na raiz |
| `tailwind.config.ts` | Tema customizado (`brand.*`, `fontFamily`, `spacing`...) e `preflight: false` para não colidir com a tipografia do Angular Material — **este é o arquivo de configurações personalizadas do Tailwind pedido** |
| `src/environments/` | `environment.ts` (dev) e `environment.prod.ts` — equivalente ao `.env` do mundo Vite, trocado automaticamente no build via `fileReplacements` |
| `src/app/app.config.ts` | Providers globais: router, `HttpClient` com os interceptors, animations (necessário pro Material) |
| `src/app/app.routes.ts` | Rotas + guardas (`authGuard`/`guestGuard`) |
| `src/app/core/interceptors/auth.interceptor.ts` | Injeta o Bearer token em toda requisição |
| `src/app/core/interceptors/error.interceptor.ts` | Trata 401 (logout automático) e normaliza mensagens de erro |
| `src/app/core/services/base.service.ts` | **Service global de CRUD**: `getAll`, `getById`, `create`, `update`, `replace`, `delete` — genérico, para qualquer entidade, via `HttpClient` |
| `src/app/core/guards/auth.guard.ts` | Guarda de rota (`CanActivateFn`) — bloqueia rotas privadas sem sessão |
| `src/app/features/auth/` | Feature de login: service próprio (não é CRUD), `AuthStore` (Signals), componente |
| `src/app/features/users/` | Feature de exemplo com CRUD completo — **service que estende o BaseService** |
| `src/app/features/home/` | Página principal pós-login |
| `src/app/layouts/auth-layout/` | Layout da tela de login (sem toolbar/sidenav) |
| `src/app/layouts/default-layout/` | Layout da página principal (toolbar + sidenav do Angular Material) |
| `Dockerfile`, `nginx.conf`, `docker-compose.yml` | Build multi-stage e serve estático com Nginx (SPA fallback, cache, healthcheck) |

---

## Caminho B — Adicionar uma feature nova em projeto existente

Use quando o projeto já segue esta arquitetura e o usuário pede uma feature nova (ex: "products",
"orders", "invoices"). Copie o padrão de `templates/src/app/features/users/`, adaptando o nome:

1. Criar a pasta `src/app/features/<feature>/` com subpastas `models/`, `services/`, `state/` e
   uma pasta por componente (ex: `<feature>-list/`).

2. **`models/<entidade>.model.ts`** — interface estendendo `BaseEntity` (de
   `@app/core/models/api.model`), mais os tipos de payload de create/update. Copie
   `templates/src/app/features/users/models/user.model.ts` como modelo.

3. **`services/<entidade>.service.ts`** — classe **`@Injectable({ providedIn: 'root' })`** que
   **estende `BaseService`**, definindo `protected resource = '/<endpoint>'`. Copie
   `templates/src/app/features/users/services/user.service.ts` como modelo:

   ```ts
   @Injectable({ providedIn: 'root' })
   export class ProductService extends BaseService<Product, CreateProductPayload, UpdateProductPayload> {
     protected override resource = '/products'
   }
   ```

   (o `override` é obrigatório porque `tsconfig.json` liga `noImplicitOverride` — sem ele o
   `tsc`/`ng build` falha.)

   Métodos que não são CRUD padrão (ex: `duplicate`, `archive`) entram como métodos extras nessa
   classe, usando `this.http` e `this.baseUrl`.

   Se a feature **não for um recurso CRUD** (ex: um fluxo de checkout, um wizard), **não** estenda
   o `BaseService` — escreva um service próprio injetando `HttpClient` diretamente, como
   `templates/src/app/features/auth/services/auth.service.ts`.

4. **`state/<entidade>.store.ts`** — classe `@Injectable({ providedIn: 'root' })` com estado em
   `signal()` (`items`, `loading`, `error`, expostos como `.asReadonly()`) e métodos assíncronos
   que chamam o service via `firstValueFrom`. Copie
   `templates/src/app/features/users/state/users.store.ts` como modelo.

5. **`<entidade>-list/<entidade>-list.component.ts` (+ `.html`)** — listagem com `mat-table` do
   Angular Material + classes utilitárias do Tailwind para espaçamento (`p-4`, `flex`, `gap-*`).
   Copie `templates/src/app/features/users/users-list/` como modelo. Se precisar de
   formulário de criação/edição, copie também `user-form-dialog/` (usa `MatDialog`).

6. **Registrar a rota** em `src/app/app.routes.ts`, dentro do bloco de rotas com
   `canActivate: [authGuard]` (a menos que a feature seja pública), usando `loadComponent` para
   manter lazy loading.

7. Se a feature aparecer na navegação principal, adicionar um item em `navItems` de
   `src/app/layouts/default-layout/default-layout.component.ts`.

---

## Convenções importantes (sempre seguir)

- **Import absoluto**: sempre `@app/features/...`, `@app/core/...` — nunca caminho relativo longo
  (`../../../`). Os aliases `@app/*` e `@env/*` já estão configurados em `tsconfig.json`.
- **Um service por recurso**, sempre em `features/<feature>/services/`. Nunca injetar
  `HttpClient` diretamente dentro de um componente — sempre passar por um service.
- **Standalone sempre**: todo componente novo usa `standalone: true` (é o default do CLI já
  configurado em `angular.json > schematics`) e importa só o que usa (`MatButtonModule`,
  `ReactiveFormsModule`...). Não criar `NgModule`.
- **Signals para estado**, não `BehaviorSubject`/`Subject` manuais — mantém o padrão dos stores já
  existentes (`AuthStore`, `UsersStore`).
- **Tailwind é para layout/espaçamento/tipografia utilitária**; **Angular Material é para os
  componentes de UI** (botões, cards, inputs, tabelas, dialogs). Evitar recriar em Tailwind o que
  o Material já oferece pronto.
- **Toda rota protegida** precisa de `canActivate: [authGuard]` em `app.routes.ts` — a guarda já
  cuida do redirect para `/login`.
- **Nunca guardar token fora do fluxo já existente** (`localStorage.getItem/setItem('auth_token')`
  em `core/interceptors/auth.interceptor.ts` e `features/auth/state/auth.store.ts`) — outros
  pontos do app não devem duplicar essa lógica.

---

## Diferenças em relação à versão Vue desta skill

| Vue (`vue-feature-based-frontend`) | Angular (esta skill) |
|---|---|
| Vite (`vite.config.ts` explícito) | Angular CLI (`application` builder já usa esbuild + Vite internamente no dev-server, sem arquivo exposto) |
| Pinia | Signals (`signal()`/`computed()` em classes `@Injectable`) |
| Vuetify | Angular Material |
| Axios (`src/services/http.ts`) | `HttpClient` + interceptors funcionais (`HttpInterceptorFn`) |
| `.env` / `import.meta.env` | `src/environments/environment.ts` + `environment.prod.ts` |
| `router.beforeEach` global | `CanActivateFn` (`authGuard`/`guestGuard`) por rota |
| Vitest | Karma + Jasmine (padrão do Angular CLI) |

---

## O que foi adicionado além do pedido original (e por quê)

Pedido: mesma coisa da versão Vue, mas para Angular — Tailwind + Nginx, biblioteca de UI
(Angular Material), state management (Signals), arquivo de config custom do Tailwind, arquitetura
feature-based, service global de CRUD + services de feature herdando dele, layouts de
login/página principal. Além disso, esta skill inclui:

1. **Angular Router com guardas de autenticação** (`authGuard`/`guestGuard`) — necessário para
   separar login da página principal, com redirecionamento automático.
2. **`HttpClient` com interceptors funcionais** (`auth.interceptor.ts` + `error.interceptor.ts`) —
   injeta o token em toda requisição e trata `401` (logout automático), em vez de cada service
   cuidar disso sozinho.
3. **`AuthStore` (Signals) persistindo o token em `localStorage`** — mantém o usuário logado entre
   refreshes da página.
4. **Aliases de import `@app/` e `@env/`** configurados em `tsconfig.json` — evita imports
   relativos longos.
5. **ESLint (`angular-eslint`) + Prettier** (+ `prettier-plugin-tailwindcss`) — padronização de
   código.
6. **Husky + lint-staged** — roda lint/format automaticamente no commit.
7. **Karma + Jasmine com teste de exemplo do `BaseService`** (usando `HttpTestingController`) —
   base de testes unitários pronta para expandir.
8. **Docker multi-stage completo** (`Dockerfile` + `docker-compose.yml` + `.dockerignore`), não só
   o `nginx.conf` — para build e deploy reproduzíveis com um único comando.
9. **`nginx.conf` com fallback de SPA, cache de assets, gzip, healthcheck e headers de segurança**
   básicos.
10. **Feature de exemplo `users`** com CRUD completo (list + create + edit + delete via
    `MatDialog`) — demonstra na prática o padrão "service herda BaseService" pedido.
11. **`.vscode/extensions.json`** com as extensões recomendadas (Angular Language Service,
    ESLint, Prettier, Tailwind IntelliSense).
12. **`environment.ts`/`environment.prod.ts`** tipados em vez de variáveis soltas.
13. **README.md** do projeto explicando a estrutura e os comandos.

### Recomendações que **não** foram implementadas (fica a critério do usuário pedir depois)

- **NgRx** (ou `@ngrx/signals`), se o app crescer e precisar de um state management mais
  estruturado que os stores baseados em Signals inclusos aqui.
- **i18n** (`@angular/localize`), se o app precisar de múltiplos idiomas.
- **Sentry** ou similar para monitoramento de erros em produção.
- **Testes E2E** (Playwright/Cypress) além dos testes unitários já incluídos.
- **CI** (GitHub Actions) rodando lint/test/build a cada push.
- **Dark mode toggle** — o Angular Material 3 (M3) suporta temas claro/escuro; falta só gerar um
  tema M3 (`ng generate @angular/material:theme-color`) e um botão que alterna a classe no `<body>`.
- **Angular Universal / SSR** — este template é SPA pura pensada para servir via Nginx; se o
  usuário precisar de SSR/SSG, isso muda o Dockerfile e o `angular.json`.
