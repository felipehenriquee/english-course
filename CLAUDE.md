# English Course — monorepo

Two independent apps in one repo:

| Path        | Stack                                                                 |
|-------------|----------------------------------------------------------------------|
| `frontend/` | Angular 19 (standalone + Signals), Tailwind, Angular Material, feature-based |
| `backend/`  | NestJS 10 + TypeORM (PostgreSQL), JWT auth, feature-based, Swagger at `/api/docs` |

Each app has its own `package.json`, toolchain, `node_modules`, lint/format config,
Dockerfile and `docker-compose.yml`. Run `npm install` inside each app separately.
The root `package.json` only carries the shared Husky hook.

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
