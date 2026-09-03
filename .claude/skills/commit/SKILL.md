---
name: commit
description: Cria commits neste monorepo seguindo o padrão de mensagem exigido pelo hook do husky (`[<scope>] <type>: <task name>`, em inglês) e SEM qualquer menção ao Claude como co-author ou "Generated with". Use quando o usuário pedir para commitar, "faça o commit", "commita isso", "gera o commit", ou quando for concluir um trabalho e registrar as mudanças no git.
---

# Commit (padrão do repositório)

Skill para criar commits neste repositório respeitando **exatamente** o formato validado pelo
hook `.husky/commit-msg` e **sem nenhuma atribuição ao Claude** na mensagem.

## Regra de ouro

A mensagem de commit **NUNCA** deve conter:

- `Co-Authored-By: Claude ...`
- `🤖 Generated with [Claude Code]...`
- qualquer linha citando Claude, Anthropic, "AI", "assistant" etc.

O commit é do usuário. A mensagem tem só o assunto (e, se necessário, um corpo objetivo).

## Formato obrigatório da mensagem

```
[<scope>] <type>: <task name>
```

Validado por `.husky/commit-msg` com esta regex na **primeira linha**:

```
^\[(front|back|front/back|repo)\] (feat|fix|ref|refactor|chore|docs|test|build|ci|perf|style)(\([a-z0-9._/-]+\))?: .+
```

- **`<scope>`** — um de: `front` · `back` · `front/back` · `repo`
- **`<type>`** — um de: `feat` · `fix` · `ref` · `refactor` · `chore` · `docs` · `test` · `build` · `ci` · `perf` · `style`
  (o `CLAUDE.md` do projeto prefere `ref` a `refactor` — use `ref`.)
- Sub-escopo opcional entre parênteses é aceito: `[back] feat(auth): add refresh token`
- **`<task name>`** — curto, imperativo, **minúsculo**, em **inglês**, **sem ponto final**

Exemplos válidos:

```
[back] feat: add refresh-token endpoint
[front] fix: guard redirect loop on expired session
[front/back] ref: rename user role values
[repo] chore: set up shared husky pre-commit
```

Mensagens começando com `Merge `, `Revert `, `fixup! `, `squash! ` ou `Reapply ` são isentas
(o hook deixa passar) — não force o formato nelas.

## Como escolher o `<scope>`

Olhe os arquivos que vão entrar no commit (`git diff --cached --name-only`, ou os que você vai
`git add`):

| Arquivos alterados | scope |
|---|---|
| só em `frontend/` | `front` |
| só em `backend/` | `back` |
| em `frontend/` **e** `backend/` (mesma mudança lógica) | `front/back` |
| raiz do repo, `.husky/`, `.claude/`, `.github/`, `package.json` raiz, docs de repo | `repo` |

Se as mudanças em `frontend/` e `backend/` **não têm relação entre si**, faça **dois commits
separados** (`front` e `back`) em vez de um `front/back`.

## Como escolher o `<type>`

- `feat` — nova funcionalidade / endpoint / tela / componente
- `fix` — correção de bug
- `ref` — refatoração sem mudança de comportamento
- `chore` — tarefa de manutenção (deps, config, limpeza) que não é build/ci
- `docs` — só documentação/comentários
- `test` — só testes
- `build` — toolchain de build, Dockerfile, bundler
- `ci` — pipelines de CI
- `perf` — melhoria de performance
- `style` — formatação/lint sem mudança de lógica

## Procedimento

1. **Descobrir o que entra no commit.**
   - Se o usuário disse o que commitar ("commita o backend", "só a feature X"), restrinja a isso.
   - Senão, rode `git status --short` e `git diff` (e `git diff --cached`). Agrupe por mudança
     lógica.
   - **Não** faça `git add -A` cego. Adicione só os arquivos da unidade lógica atual.
   - Ignore/deixe de fora artefatos não relacionados que já estavam sujos na árvore, a menos que
     o usuário peça para incluir — mencione que ficaram de fora.

2. **Uma unidade lógica = um commit.** Se houver várias (ex: uma feature no front + um ajuste de
   config no repo), faça vários commits em sequência, cada um com seu escopo/tipo.

3. **Montar a mensagem** no formato acima. Só o assunto na maioria dos casos. Se precisar de
   corpo, deixe uma linha em branco após o assunto e escreva bullets curtos — **sem** trailer de
   atribuição.

4. **Commitar** com o assunto via `-m` (e `-m` extra por parágrafo de corpo). Exemplo:

   ```bash
   git add <arquivos-da-unidade>
   git commit -m "[front] feat: add course list screen"
   ```

5. **Hooks vão rodar:**
   - `pre-commit` → `lint-staged` em `frontend/` e/ou `backend/` conforme os arquivos staged.
     Pode reformatar arquivos (eslint --fix / prettier) e reincorporá-los ao commit
     automaticamente. Se falhar por erro de lint, corrija o código e refaça.
   - `commit-msg` → valida o formato. Se recusar, ajuste **só a mensagem** e rode de novo
     (`git commit -m "..."` — os arquivos continuam staged).

6. **Conferir**: `git log --oneline -5` e reportar o(s) hash(es) criado(s).

7. **Não** dê `git push` a menos que o usuário peça explicitamente.

## Checklist antes de rodar `git commit`

- [ ] Primeira linha bate com a regex (`[scope] type: task`)
- [ ] `task name` em inglês, imperativo, minúsculo, sem ponto final
- [ ] scope condiz com as pastas realmente alteradas
- [ ] **nenhuma** linha de `Co-Authored-By` / `Generated with` / menção a Claude/Anthropic
- [ ] só os arquivos da unidade lógica estão staged
