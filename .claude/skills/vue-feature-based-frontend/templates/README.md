# __PROJECT_NAME__

Frontend Vue 3 + TypeScript, gerado a partir da skill `vue-feature-based-frontend`.

## Stack

- **Vite** — build e dev server
- **Vue 3** (`<script setup>`) + **TypeScript**
- **Vue Router 4** com guarda de autenticação
- **Pinia** + `pinia-plugin-persistedstate`
- **Vuetify 3** — biblioteca de componentes
- **Tailwind CSS** — utilitários de layout/espaçamento (preflight desativado, ver `tailwind.config.ts`)
- **Axios** — HTTP client, centralizado em `src/services/http.ts`
- **Docker + Nginx** — build multi-stage para produção
- **ESLint + Prettier + Husky/lint-staged** — qualidade de código
- **Vitest** — testes unitários

## Estrutura (feature-based)

```
src/
  assets/styles/        estilos globais (tailwind base)
  components/            componentes compartilhados entre features (se necessário)
  composables/           lógica reutilizável (ex: useCrud)
  layouts/               AuthLayout (login) e DefaultLayout (app logado)
  plugins/                configuração de vuetify e pinia
  router/                 rotas + guarda de autenticação
  services/               http.ts (axios) e BaseService.ts (CRUD genérico)
  types/                  tipos compartilhados (BaseEntity, PaginatedResponse...)
  views/                  páginas globais (ex: NotFoundView)
  features/
    auth/                 login (service próprio + store + view)
    users/                 exemplo de CRUD completo (service herda BaseService)
    <nova-feature>/
      services/
      store/
      views/
      components/
      types/
```

## Padrão de service

- `src/services/BaseService.ts` implementa `getAll`, `getById`, `create`, `update`, `replace`, `delete`.
- Toda feature com um recurso REST convencional cria um service que **estende** o `BaseService`:

  ```ts
  class ProductService extends BaseService<Product> {
    constructor() { super('/products') }
  }
  ```

- Fluxos que não são CRUD (login, upload, relatórios) ganham um service próprio, usando `http` diretamente (veja `features/auth/services/authService.ts`).

## Comandos

```bash
npm install
npm run dev        # dev server
npm run build       # build de produção (type-check + vite build)
npm run lint         # eslint --fix
npm run format       # prettier
npm run test         # vitest run
```

## Variáveis de ambiente

Copie `.env.example` para `.env` e ajuste:

```
VITE_API_BASE_URL=http://localhost:3000/api
VITE_APP_NAME="Meu App"
```

## Docker / Nginx

```bash
docker compose up --build
# app disponível em http://localhost:8080
```

O `Dockerfile` faz build multi-stage (Node -> Nginx) e o `nginx.conf` já inclui fallback de SPA para o `vue-router` em history mode, cache de assets e um endpoint `/healthz`.
