---
name: nest-feature-based-backend
description: Cria (do zero) ou expande um backend NestJS + TypeScript com TypeORM (Postgres/MySQL/SQLite, à escolha), autenticação JWT, arquitetura feature-based e um BaseService de CRUD genérico que cada feature estende, além de Docker/docker-compose para produção. Use quando o usuário pedir para criar/gerar/bootstrapar um novo backend/API Nest, adicionar uma nova feature/recurso CRUD, criar um service que herda de um service global, configurar autenticação JWT, ou configurar deploy com Docker para um projeto NestJS.
---

# Nest Feature-Based Backend

Skill para gerar (ou expandir) um backend **NestJS + TypeScript**, organizado por **feature**, com
**TypeORM**, autenticação **JWT** (Passport), um **service global de CRUD** que cada feature
estende, e deploy via **Docker + docker-compose**.

Esta skill é pensada para ser o par de três skills de frontend já existentes —
`vue-feature-based-frontend`, `angular-feature-based-frontend` e `react-feature-based-frontend`.
Os endpoints gerados aqui (`/api/auth/login`, `/api/users`...) usam **exatamente** o contrato que
os `authService`/`userService` dessas três skills já esperam — ver seção "Contrato de API" abaixo.

Todos os arquivos prontos para copiar estão em `templates/`, com a mesma estrutura de pastas que o
projeto final deve ter. Prefira **copiar e adaptar** esses arquivos a escrever do zero.

## Quando usar esta skill

- "cria um backend/API em Nest"
- "monta o backend seguindo arquitetura feature-based"
- "cria uma feature de `<recurso>` com CRUD no backend"
- "cria um service que herda de um service global" (em projeto Nest)
- "adiciona autenticação JWT no backend"
- "configura Docker para esse backend Nest"

## Passo 0 — Perguntas obrigatórias antes de gerar o projeto

Diferente das skills de frontend, aqui **sempre pergunte qual banco de dados usar antes de
começar** — a resposta muda o driver instalado, o `.env` e o serviço de banco no
`docker-compose.yml`:

1. **Banco de dados**: PostgreSQL (default desta skill, já vem tudo pronto) / MySQL / SQLite.
2. Nome do projeto/pasta (default: `backend`).
3. Se é projeto **novo** (scaffold completo) ou **feature nova** em projeto existente que já segue
   este padrão (só copia a pasta da feature).

Não pergunte sobre TypeORM/JWT/class-validator/Swagger — isso já é a base fixa desta skill. Se o
usuário já tiver dito o banco (ex: "cria um backend Nest com MySQL"), não precisa perguntar nem
esse item.

### Trocando de banco (se não for Postgres)

| Banco | Instalar | Trocar no `.env` | `docker-compose.yml` |
|---|---|---|---|
| PostgreSQL (default) | já incluso (`pg`) | `DB_TYPE=postgres` | serviço `db` já pronto (imagem `postgres:16-alpine`) |
| MySQL | `npm i mysql2` (e pode remover `pg`) | `DB_TYPE=mysql`, `DB_PORT=3306` | troque a imagem do serviço `db` para `mysql:8` e ajuste `MYSQL_*` no lugar de `POSTGRES_*` |
| SQLite | `npm i better-sqlite3` | `DB_TYPE=sqlite`, defina `DB_SQLITE_PATH` | remova o serviço `db` inteiro (não precisa de banco separado) |

`src/config/typeorm.config.ts` já lê `DB_TYPE` e monta as opções certas — não precisa reescrever
esse arquivo, só instalar o driver e ajustar o `.env`/`docker-compose.yml` conforme a tabela acima.

---

## Caminho A — Projeto novo (scaffold completo)

1. **Criar o projeto base:**

   ```bash
   npx @nestjs/cli@10 new <nome-projeto> --package-manager npm --skip-git
   cd <nome-projeto>
   ```

2. **Copiar os arquivos de `templates/`** para a raiz do projeto, **sobrescrevendo** os que o
   `nest new` já gerou (`package.json`, `tsconfig.json`, `nest-cli.json`, `src/main.ts`,
   `src/app.module.ts`, e removendo `src/app.controller.ts`, `src/app.service.ts` e seus specs,
   que não são usados neste padrão). Copie a árvore inteira de `templates/src/` e todos os
   arquivos de configuração na raiz de `templates/` (incluindo os que começam com `.`, como
   `.env.example`, `.gitignore`, `.editorconfig`, `.dockerignore`, `.vscode/`, `.husky/`).

   ```bash
   cp -r templates/. <nome-projeto>/
   rm -f <nome-projeto>/src/app.controller.ts <nome-projeto>/src/app.controller.spec.ts \
         <nome-projeto>/src/app.service.ts 2>/dev/null
   ```

3. **Substituir os placeholders** nos arquivos copiados:
   - `__PROJECT_NAME__` → nome do projeto, em `package.json`, `.env.example` (DB_DATABASE),
     `docker-compose.yml`.

4. **Instalar dependências** (o `package.json` do template já lista todas: TypeORM + `pg`,
   `@nestjs/passport`/`@nestjs/jwt`/`passport-jwt`, `class-validator`/`class-transformer`,
   `@nestjs/swagger`, `@nestjs/throttler`, `helmet`, `compression`, `bcryptjs`, ESLint/Prettier,
   Husky/lint-staged):

   ```bash
   npm install
   ```

   Se o banco escolhido no Passo 0 não for Postgres, instale o driver certo agora (ver tabela
   acima).

5. **Criar o `.env`** a partir do `.env.example` e ajustar `DB_*` (conforme o banco escolhido),
   `JWT_SECRET` (gere um valor forte) e `CORS_ORIGIN` (porta do frontend: 5173 para
   Vite/Vue/React, 4200 para Angular).

6. **Subir o banco** (se Postgres/MySQL via Docker):

   ```bash
   docker compose up -d db
   ```

   (Para SQLite não precisa — o arquivo é criado automaticamente em `DB_SQLITE_PATH`.)

7. **Ativar o husky** (hooks de git — só faz sentido se o projeto for um repo git):

   ```bash
   git init -q 2>/dev/null; npx husky init 2>/dev/null || true
   ```

8. **Rodar `npm run start:dev`** para validar que sobe sem erro. Com `DB_SYNCHRONIZE=true` (default
   do `.env.example`), o TypeORM já cria as tabelas automaticamente — não precisa rodar migration
   na primeira vez.

9. Explicar ao usuário, em poucas linhas: onde fica a API (`http://localhost:3000/api`), o Swagger
   (`/api/docs`), como criar uma feature nova (Caminho B abaixo) e como subir tudo com Docker
   (`docker compose up --build`).

### O que cada arquivo/pasta de `templates/` faz

| Arquivo/pasta | Papel |
|---|---|
| `src/config/typeorm.config.ts` | Monta as opções do TypeORM a partir de `DB_TYPE` — troca de banco sem reescrever código |
| `src/config/typeorm.datasource.ts` | `DataSource` usado só pela CLI de migrations (`npm run migration:*`) |
| `src/common/entities/base.entity.ts` | `id` (uuid) + `createdAt`/`updatedAt` — toda entidade estende esta classe |
| `src/common/services/base.service.ts` | **Service global de CRUD**: `getAll` (paginado), `getById`, `create`, `update`, `delete` — genérico, para qualquer entidade |
| `src/common/dto/pagination-query.dto.ts` / `paginated-response.dto.ts` | Query params de listagem e formato de resposta paginada — mesmo shape do `PaginatedResponse<T>` das skills de frontend |
| `src/common/filters/http-exception.filter.ts` | Normaliza TODO erro no mesmo formato JSON (`message`, `statusCode`, `path`, `timestamp`) |
| `src/common/guards/jwt-auth.guard.ts` | Guarda JWT **global** (registrada em `app.module.ts`) — toda rota exige token, exceto as com `@Public()` |
| `src/common/decorators/public.decorator.ts` / `current-user.decorator.ts` | `@Public()` libera um endpoint do guard global; `@CurrentUser()` extrai o usuário autenticado |
| `src/features/auth/` | Login/registro/logout/me — service próprio (não é CRUD), estratégia JWT do Passport |
| `src/features/users/` | Feature de exemplo com CRUD completo — **service que estende o BaseService**, com hash de senha no create/update |
| `src/features/health/` | `GET /health` — liveness/readiness probe, usado pelo `HEALTHCHECK` do Dockerfile |
| `Dockerfile`, `docker-compose.yml` | Build multi-stage (sem nginx — API não serve estático) + serviço de banco |

---

## Caminho B — Adicionar uma feature nova em projeto existente

Use quando o projeto já segue esta arquitetura e o usuário pede uma feature nova (ex: "products",
"orders", "invoices"). Copie o padrão de `templates/src/features/users/`, adaptando o nome:

1. Criar a pasta `src/features/<feature>/` com subpastas `entities/`, `dto/`.

2. **`entities/<entidade>.entity.ts`** — classe `@Entity(...)` estendendo `BaseEntity` (de
   `@/common/entities/base.entity`), que já dá `id`/`createdAt`/`updatedAt`. Copie
   `templates/src/features/users/entities/user.entity.ts` como modelo.

3. **`dto/create-<entidade>.dto.ts`** e **`dto/update-<entidade>.dto.ts`** — DTOs com
   `class-validator` (o de update normalmente é `PartialType(CreateDto)`). Copie os DTOs de
   `templates/src/features/users/dto/` como modelo.

4. **`<feature>.service.ts`** — classe `@Injectable()` que **estende `BaseService`**, injetando o
   `Repository` da entidade:

   ```ts
   @Injectable()
   export class ProductsService extends BaseService<Product> {
     constructor(@InjectRepository(Product) repo: Repository<Product>) {
       super(repo)
     }
   }
   ```

   Métodos que não são CRUD padrão (ex: `duplicate`, `archive`, uma busca com filtro específico)
   entram como métodos extras nessa classe, usando `this.repository` diretamente.

   Se a feature **não for um recurso CRUD** (ex: um fluxo de checkout, geração de relatório),
   **não** estenda o `BaseService` — escreva um service próprio, como
   `templates/src/features/auth/auth.service.ts`.

5. **`<feature>.controller.ts`** — endpoints REST convencionais (`GET`/`GET :id`/`POST`/`PATCH
   :id`/`DELETE :id`) chamando o service 1:1. Copie
   `templates/src/features/users/users.controller.ts` como modelo. Adicione `@ApiTags(...)` e
   `@ApiBearerAuth()` pro Swagger.

6. **`<feature>.module.ts`** — importa `TypeOrmModule.forFeature([Entidade])`, declara controller e
   service. Exporte o service só se outra feature precisar dele (como `UsersModule` faz pro
   `AuthModule`).

7. **Registrar o módulo** em `src/app.module.ts`, no array `imports`.

---

## Contrato de API (alinhado às 3 skills de frontend)

| Endpoint | Método | Equivalente no frontend |
|---|---|---|
| `/api/auth/login` | POST | `authService.login()` — retorna `{ token, user }` |
| `/api/auth/register` | POST | bônus desta skill (frontends não têm tela de registro pronta) |
| `/api/auth/logout` | POST | `authService.logout()` — no-op (JWT é stateless) |
| `/api/auth/me` | GET | `authService.me()` — retorna `AuthUser` |
| `/api/users` | GET | `userService.getAll()` — retorna `PaginatedResponse<User>` |
| `/api/users/:id` | GET | `userService.getById()` |
| `/api/users` | POST | `userService.create()` |
| `/api/users/:id` | PATCH | `userService.update()` |
| `/api/users/:id` | DELETE | `userService.delete()` |
| `/api/health` | GET | equivalente ao `/healthz` do `nginx.conf` das skills de frontend |

A entidade `User` (`name`, `email`, `role: 'admin'|'editor'|'viewer'`, `active`) espelha
exatamente o tipo `User` das 3 skills de frontend — o `password` nunca aparece nas respostas
(`@Exclude()` + `ClassSerializerInterceptor` global).

---

## Convenções importantes (sempre seguir)

- **Import absoluto**: sempre `@/features/...`, `@/common/...` — nunca caminho relativo longo
  (`../../../`). O alias `@` já está configurado em `tsconfig.json` e no `moduleNameMapper` do
  Jest.
- **Um module por feature**, sempre em `features/<feature>/`. Nunca injetar `Repository`
  diretamente em um controller — sempre passar por um service.
- **Toda rota é protegida por padrão** (guarda JWT global em `app.module.ts`). Endpoints públicos
  (login, register, health) precisam do decorator `@Public()` explicitamente — nunca desative o
  guard globalmente para "facilitar".
- **DTOs sempre com `class-validator`**, nunca aceite `any`/objeto solto no `@Body()`. O
  `ValidationPipe` global (`whitelist: true, forbidNonWhitelisted: true`) já rejeita campos que não
  estão no DTO.
- **Senhas nunca em texto puro** fora do DTO de entrada — `UsersService.create`/`update` já fazem o
  hash (bcryptjs); não duplique esse hash em outro lugar (veja como `AuthService.register` delega
  pro `UsersService` em vez de fazer o hash ele mesmo).
- **Nunca retornar a entidade do TypeORM crua quando ela tiver campo sensível** — use `@Exclude()`
  na entidade (como em `User.password`) e confie no `ClassSerializerInterceptor` global, em vez de
  montar objetos manualmente em todo endpoint.

---

## O que foi adicionado além do pedido original (e por quê)

Pedido: backend Node com Nest, arquitetura feature-based, service global de CRUD (getAll/getById/
create/update/delete) + services de feature herdando dele. Além disso, esta skill inclui:

1. **Autenticação JWT completa** (login/registro/logout/me) — necessária pra existir uma sessão
   real por trás do login que as 3 skills de frontend já implementam.
2. **Guarda JWT global** (`JwtAuthGuard` + `@Public()`) — protege toda rota por padrão, em vez de
   exigir `@UseGuards()` manual em cada controller (mais fácil de esquecer e deixar uma rota
   exposta por engano).
3. **TypeORM com driver configurável** (`DB_TYPE`) — permite trocar entre Postgres/MySQL/SQLite
   sem reescrever o código de acesso a dados, só o `.env`.
4. **Paginação de verdade no `BaseService.getAll`** — retorna `{ data, total, page, perPage }`,
   mesmo shape que o `PaginatedResponse<T>` das 3 skills de frontend já sabem interpretar.
5. **Validação automática de DTOs** (`class-validator` + `ValidationPipe` global) — rejeita payload
   inválido ou com campos a mais antes de chegar no service.
6. **Filtro global de exceções** — toda resposta de erro sai no mesmo formato JSON, com `message`
   no campo que o interceptor de erro do Axios das 3 skills de frontend já lê.
7. **Swagger automático** (`/api/docs`) — documentação sempre atualizada com o código, sem escrever
   YAML/JSON manualmente.
8. **Rate limiting global** (`@nestjs/throttler`) — proteção básica contra abuso/brute-force,
   inclusive no `/auth/login`.
9. **helmet + compression** — cabeçalhos de segurança e gzip na própria API, papel parecido com o
   que o `nginx.conf` fazia pro frontend.
10. **`ClassSerializerInterceptor` global + `@Exclude()`** — garante que o hash da senha nunca
    vaze numa resposta JSON, mesmo se alguém esquecer de mapear manualmente.
11. **Docker multi-stage + docker-compose com banco incluso** — sobe API + Postgres com um único
    comando, com healthcheck em ambos.
12. **Husky + lint-staged, ESLint + Prettier** — mesma padronização de código das skills de
    frontend.
13. **Testes unitários (Jest) do `UsersService`/`BaseService`** + esqueleto de teste e2e do
    `/health` — base de testes pronta para expandir.
14. **README.md** do projeto explicando a estrutura, os comandos e o contrato de API.

### Recomendações que **não** foram implementadas (fica a critério do usuário pedir depois)

- **Refresh tokens** — hoje é só um access token com expiração fixa (`JWT_EXPIRES_IN`); se o app
  precisar de sessões mais longas sem relogar, isso vira um fluxo de refresh token + endpoint
  dedicado.
- **Migrations de verdade em produção** — o `.env.example` vem com `DB_SYNCHRONIZE=true` (bom para
  prototipagem); em produção, desligue isso e use `npm run migration:generate`/`migration:run`.
- **RBAC/permissões por role** — a entidade `User` já tem `role`, mas não há um `RolesGuard`
  aplicando restrição por endpoint ainda.
- **Cache** (Redis) para respostas ou para uma blocklist de tokens revogados no logout.
- **Testes E2E cobrindo auth/users** além do esqueleto de `/health` incluído.
- **CI** (GitHub Actions) rodando lint/test/build a cada push.
- **Observabilidade** (logs estruturados, tracing, métricas Prometheus) além do `LoggingInterceptor`
  básico incluído.
