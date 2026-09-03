# __PROJECT_NAME__

Frontend Angular (standalone + Signals), gerado a partir da skill `angular-feature-based-frontend`.

## Stack

- **Angular CLI** (`application` builder, esbuild + dev-server Vite internamente) — sem `vite.config.ts` próprio, é abstraído pelo Angular
- **Angular** standalone components (sem NgModules) + **Signals** para estado (equivalente ao Pinia)
- **Angular Router** com guarda de autenticação
- **Angular Material** — biblioteca de componentes (equivalente ao Vuetify)
- **Tailwind CSS** — utilitários de layout/espaçamento (preflight desativado, ver `tailwind.config.ts`)
- **HttpClient + interceptors funcionais** — equivalente ao Axios + interceptors da versão Vue
- **Docker + Nginx** — build multi-stage para produção
- **ESLint (angular-eslint) + Prettier + Husky/lint-staged** — qualidade de código
- **Karma + Jasmine** — testes unitários (padrão do Angular CLI)

## Estrutura (feature-based)

```
src/
  environments/           environment.ts (dev) e environment.prod.ts — equivalente ao .env
  app/
    app.config.ts          providers globais (router, httpClient+interceptors, animations)
    app.routes.ts           rotas raiz + guardas
    core/
      services/             http (via HttpClient) e BaseService.ts (CRUD genérico)
      interceptors/          auth.interceptor.ts e error.interceptor.ts
      guards/                 auth.guard.ts (protege rotas privadas)
      models/                 tipos compartilhados (BaseEntity, PaginatedResponse...)
    layouts/
      auth-layout/            layout da tela de login
      default-layout/         layout da página principal (toolbar + sidenav Material)
    shared/
      not-found/               página 404
    features/
      auth/                    login (service próprio + store de signals + componente)
      users/                    exemplo de CRUD completo (service herda BaseService)
      <nova-feature>/
        models/
        services/
        state/
        <algum-component>/
```

## Padrão de service

- `src/app/core/services/base.service.ts` implementa `getAll`, `getById`, `create`, `update`, `replace`, `delete` usando `HttpClient` (Observables/RxJS).
- Toda feature com um recurso REST convencional cria um service que **estende** o `BaseService`:

  ```ts
  @Injectable({ providedIn: 'root' })
  export class ProductService extends BaseService<Product> {
    protected resource = '/products'
  }
  ```

- Fluxos que não são CRUD (login, upload, relatórios) ganham um service próprio, injetando `HttpClient` diretamente (veja `features/auth/services/auth.service.ts`).

## Comandos

```bash
npm install
npm start           # ng serve
npm run build:prod  # build de produção
npm run lint         # eslint via angular-eslint
npm run format       # prettier
npm test             # karma + jasmine
```

## Variáveis de ambiente

Não existe `.env` no Angular CLI — os valores ficam em `src/environments/environment.ts` (dev) e `src/environments/environment.prod.ts` (produção), trocados automaticamente no build via `fileReplacements` (ver `angular.json`).

## Docker / Nginx

```bash
docker compose up --build
# app disponível em http://localhost:8080
```

O `Dockerfile` faz build multi-stage (Node -> Nginx) e o `nginx.conf` já inclui fallback de SPA para o Angular Router, cache de assets e um endpoint `/healthz`.
