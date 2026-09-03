# __PROJECT_NAME__

Frontend React + TypeScript, gerado a partir da skill `react-feature-based-frontend`.

## Stack

- **Vite** — build e dev server
- **React 18** + **TypeScript**
- **react-router-dom** com guardas de rota (`ProtectedRoute`/`GuestRoute`)
- **Zustand** — estado global (equivalente ao Pinia/Signals)
- **MUI (Material UI)** — biblioteca de componentes (equivalente ao Vuetify/Angular Material)
- **Tailwind CSS** — utilitários de layout/espaçamento (preflight desativado, ver `tailwind.config.ts`)
- **Axios** — HTTP client, centralizado em `src/lib/http.ts`
- **Docker + Nginx** — build multi-stage para produção
- **ESLint + Prettier + Husky/lint-staged** — qualidade de código
- **Vitest** — testes unitários

## Estrutura (feature-based)

```
src/
  theme/                  tema único do MUI (cores alinhadas ao tailwind.config.ts)
  styles/index.css         diretivas do tailwind
  lib/                      http.ts (axios + interceptors)
  services/                 BaseService.ts (CRUD genérico)
  types/                    tipos compartilhados (BaseEntity, PaginatedResponse...)
  router/                    AppRouter.tsx, ProtectedRoute.tsx, GuestRoute.tsx
  layouts/                   AuthLayout (login) e DefaultLayout (app logado)
  hooks/                      useCrud.ts (alternativa leve a uma store)
  shared/                     componentes/páginas compartilhados (ex: NotFoundPage)
  features/
    auth/                     login (service próprio + store zustand + página)
    users/                     exemplo de CRUD completo (service herda BaseService)
    <nova-feature>/
      services/
      store/
      types/
      pages/
      components/
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

O `Dockerfile` faz build multi-stage (Node -> Nginx) e o `nginx.conf` já inclui fallback de SPA para o `react-router-dom` em history mode, cache de assets e um endpoint `/healthz`.
