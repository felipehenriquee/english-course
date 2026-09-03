# __PROJECT_NAME__

Backend NestJS + TypeScript, gerado a partir da skill `nest-feature-based-backend`.
Pensado pra ser o par das skills de frontend `vue-feature-based-frontend`,
`angular-feature-based-frontend` e `react-feature-based-frontend` — o contrato de API
(`/api/auth/login`, `/api/users`...) já bate com o que os services de lá esperam.

## Stack

- **NestJS** + **TypeScript**
- **TypeORM** (Repository pattern) — banco configurável via `.env` (`DB_TYPE`: postgres/mysql/sqlite)
- **Passport + JWT** — autenticação stateless, guarda global (`JwtAuthGuard`) com opt-out via `@Public()`
- **class-validator / class-transformer** — validação de DTOs e serialização (esconde `password`)
- **@nestjs/swagger** — documentação automática em `/api/docs`
- **@nestjs/throttler** — rate limiting global
- **helmet + compression** — cabeçalhos de segurança e gzip
- **Docker + docker-compose** (com serviço de banco) para produção
- **ESLint + Prettier + Husky/lint-staged** — qualidade de código
- **Jest** — testes unitários e e2e

## Estrutura (feature-based)

```
src/
  main.ts                 bootstrap: prefixo /api, CORS, helmet, swagger, validation pipe
  app.module.ts             módulo raiz: importa TypeORM, throttler e os módulos de feature
  config/
    typeorm.config.ts        monta as opções do TypeORM a partir do DB_TYPE
    typeorm.datasource.ts     DataSource usado só pela CLI de migrations
  common/
    entities/base.entity.ts   id + timestamps compartilhados por toda entidade
    services/base.service.ts  BaseService: getAll/getById/create/update/delete genérico
    dto/                       PaginationQueryDto, PaginatedResponseDto
    filters/                   HttpExceptionFilter (formato de erro único)
    interceptors/               LoggingInterceptor
    guards/                     JwtAuthGuard (global, respeita @Public())
    decorators/                 @Public(), @CurrentUser()
  features/
    auth/                      login/registro/logout/me (service próprio, não é CRUD)
    users/                     exemplo de CRUD completo (service herda BaseService)
    health/                    GET /health (liveness/readiness probe)
    <nova-feature>/
      entities/
      dto/
      <feature>.service.ts
      <feature>.controller.ts
      <feature>.module.ts
```

## Padrão de service

- `src/common/services/base.service.ts` implementa `getAll` (paginado), `getById`, `create`, `update`, `delete` em cima de um `Repository<T>` do TypeORM.
- Toda feature com um recurso CRUD convencional cria um service que **estende** o `BaseService`:

  ```ts
  @Injectable()
  export class ProductsService extends BaseService<Product> {
    constructor(@InjectRepository(Product) repo: Repository<Product>) {
      super(repo)
    }
  }
  ```

- Fluxos que não são CRUD (login, upload, relatórios) ganham um service próprio (veja `features/auth/auth.service.ts`).

## Comandos

```bash
npm install
npm run start:dev    # dev com watch
npm run build          # build de produção
npm run start:prod      # roda o build
npm run lint             # eslint --fix
npm run format            # prettier
npm test                  # jest (unit)
npm run test:e2e           # jest (e2e, precisa de banco acessível)
```

## Variáveis de ambiente

Copie `.env.example` para `.env` e ajuste — principalmente `DB_*`, `JWT_SECRET` e `CORS_ORIGIN`
(porta do frontend: 5173 para Vite/Vue/React, 4200 para Angular).

## Docker

```bash
docker compose up --build
# API disponível em http://localhost:3000/api
# Swagger em http://localhost:3000/api/docs
```

`docker-compose.yml` já sobe um Postgres junto (padrão desta skill). Se o projeto usa MySQL ou
SQLite, ajuste o serviço `db` (ou remova, no caso do SQLite) — ver `SKILL.md`.
