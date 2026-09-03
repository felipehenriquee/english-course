/**
 * Catálogo central de mensagens de erro da API.
 *
 * A ideia: o código de domínio só LANÇA um `code` (+ params); o texto de
 * fato mora aqui, num único lugar. O `{{placeholder}}` é trocado pelo valor
 * correspondente em `params` na hora de montar a mensagem — ex:
 *
 *   throw new NotFoundError('Usuário')   // code: 'not_found', params: { entity: 'Usuário' }
 *   // -> "Usuário não encontrado"
 *
 * O front (frontend/src/app/core/errors/error-messages.ts) tem um catálogo
 * espelho com as MESMAS chaves, pra montar/localizar a mensagem sem depender
 * do texto que a API mandou. Ao adicionar/renomear uma chave aqui, atualize
 * lá também.
 */
export const ERROR_MESSAGES = {
  // CRUD genérico (BaseService)
  not_found: '{{entity}} não encontrado',
  already_exists: '{{entity}} já existe',

  // Auth
  invalid_credentials: 'E-mail ou senha inválidos',
  email_already_registered: 'Já existe uma conta com este e-mail',

  // Genéricos
  validation_error: 'Dados inválidos: {{details}}',
  forbidden: 'Você não tem permissão para acessar este recurso',
  internal_error: 'Erro interno inesperado',
} as const

export type ErrorCode = keyof typeof ERROR_MESSAGES

/** Valores aceitos como parâmetro de interpolação de mensagem. */
export type ErrorParams = Record<string, string | number>

const PLACEHOLDER = /\{\{\s*(\w+)\s*\}\}/g

/**
 * Troca cada `{{chave}}` pelo valor de `params.chave`. Placeholder sem valor
 * correspondente é mantido como está — ajuda a perceber template incompleto.
 */
export function interpolate(template: string, params: ErrorParams = {}): string {
  return template.replace(PLACEHOLDER, (_match, key: string) =>
    params[key] != null ? String(params[key]) : `{{${key}}}`,
  )
}

/** Monta a mensagem final a partir do code + params. */
export function resolveErrorMessage(code: ErrorCode, params: ErrorParams = {}): string {
  return interpolate(ERROR_MESSAGES[code] ?? ERROR_MESSAGES.internal_error, params)
}
