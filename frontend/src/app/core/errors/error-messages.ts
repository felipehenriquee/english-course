/**
 * Catálogo de mensagens de erro do frontend — espelho de
 * backend/src/common/errors/error-messages.ts (MESMAS chaves).
 *
 * A API manda só `{ code, params }` no corpo do erro; aqui a gente monta a
 * string que aparece pro usuário. `{{chave}}` é trocado pelo valor de
 * `params.chave`. Se um dia o app precisar de i18n, é só trocar este objeto
 * por um dicionário por idioma.
 *
 * Ao adicionar/renomear uma chave, atualize também o catálogo do backend.
 */
export const ERROR_MESSAGES: Record<string, string> = {
  // CRUD genérico (BaseService)
  not_found: '{{entity}} não encontrado',
  already_exists: '{{entity}} já existe',

  // Auth
  invalid_credentials: 'E-mail ou senha inválidos',
  email_already_registered: 'Já existe uma conta com este e-mail',

  // Genéricos
  validation_error: 'Dados inválidos: {{details}}',
  forbidden: 'Você não tem permissão para acessar este recurso',
  internal_error: 'Erro inesperado ao comunicar com a API',
}

/** Usada quando não há `code` reconhecido nem `message` vinda da API. */
export const FALLBACK_ERROR_MESSAGE = 'Erro inesperado ao comunicar com a API'

const PLACEHOLDER = /\{\{\s*(\w+)\s*\}\}/g

/**
 * Troca cada `{{chave}}` pelo valor de `params.chave`. Placeholder sem valor
 * correspondente é mantido como está.
 */
export function interpolate(template: string, params: Record<string, unknown> = {}): string {
  return template.replace(PLACEHOLDER, (_match, key: string) => {
    const value = params[key]
    return value != null ? String(value) : `{{${key}}}`
  })
}

/**
 * Monta a mensagem final:
 *  1. se o `code` existe no catálogo -> usa o template daqui (+ interpolação);
 *  2. senão -> cai pra `apiMessage` (o texto já resolvido que a API mandou);
 *  3. senão -> fallback genérico.
 */
export function resolveErrorMessage(
  code: string | null | undefined,
  params: Record<string, unknown> = {},
  apiMessage?: string | null,
): string {
  if (code && ERROR_MESSAGES[code]) {
    return interpolate(ERROR_MESSAGES[code], params)
  }
  return apiMessage?.trim() || FALLBACK_ERROR_MESSAGE
}
