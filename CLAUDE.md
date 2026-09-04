# SAPO — monorepo

**SAPO** — Sistema Acadêmico e Pedagógico Online (Online Academic and Pedagogical System).

Two independent apps in one repo:

| Path        | Stack                                                                 |
|-------------|----------------------------------------------------------------------|
| `frontend/` | Angular 19 (standalone + Signals), Tailwind, Angular Material, feature-based |
| `backend/`  | NestJS 10 + TypeORM (PostgreSQL), JWT auth, feature-based, Swagger at `/api/docs` |

Each app has its own `package.json`, toolchain, `node_modules`, lint/format config,
Dockerfile and `docker-compose.yml`. Run `npm install` inside each app separately
(or `npm run install:all` from the root).

The root `package.json` carries the shared Husky hook plus dev-orchestration
scripts (no npm workspaces):

| Script | What it does |
|--------|--------------|
| `npm run dev` | runs backend (`start:dev`) + frontend (`ng serve`) together via `concurrently` |
| `npm run dev:back` / `npm run dev:front` | run one side only |
| `npm run db:up` / `npm run db:down` | start / stop the MySQL container (`backend/docker-compose.yml`) |
| `npm run install:all` | `npm install` at the root + both apps |

## Commit message convention

**Every commit message must follow this format, written in English:**

```
[<scope>] <type>: <task name>
```

- `<scope>`: `front` · `back` · `front/back` (both apps) · `repo` (root-level tooling)
- `<type>`: `feat` · `fix` · `ref` (refactor) · `chore` · `docs` · `test` · `build` · `ci` · `perf` · `style`
- `<task name>`: short, imperative, lowercase, no trailing period

Examples:

```
[back] feat: add refresh-token endpoint
[front] fix: guard redirect loop on expired session
[front/back] ref: rename User.role values
[repo] chore: set up shared husky pre-commit
```

`Merge …`, `Revert …`, `fixup!`/`squash!` messages are exempt.
The `commit-msg` Husky hook enforces this.

## Husky (git hooks)

Husky is installed **once at the repo root** (`root package.json` → `prepare` script,
hooks in `.husky/`). After cloning: `npm install` at the root.

- `.husky/pre-commit` — runs each app's `lint-staged` only when that app has staged files.
- `.husky/commit-msg` — validates the commit message format above.
