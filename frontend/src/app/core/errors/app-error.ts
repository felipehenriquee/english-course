import { HttpErrorResponse } from '@angular/common/http'

import { resolveErrorMessage } from '@app/core/errors/error-messages'

/**
 * Corpo de erro padronizado que a API devolve
 * (ver backend/src/common/filters/http-exception.filter.ts).
 */
export interface ApiErrorBody {
  statusCode: number
  code: string | null
  params?: Record<string, unknown>
  message?: string
  path?: string
  timestamp?: string
}

/**
 * Erro de aplicação já normalizado: `message` legível pro usuário, mais o
 * `code`/`params`/`status` originais — caso algum componente queira tratar
 * um caso específico (ex: destacar um campo, redirecionar num 403...).
 *
 * Como estende `Error`, quem só lê `err.message` (os stores, por ex.)
 * continua funcionando sem mudança.
 */
export class AppError extends Error {
  readonly code: string | null
  readonly params: Record<string, unknown>
  readonly status: number

  constructor(
    message: string,
    code: string | null,
    params: Record<string, unknown>,
    status: number,
  ) {
    super(message)
    this.name = 'AppError'
    this.code = code
    this.params = params
    this.status = status
  }
}

/** Constrói um `AppError` a partir da resposta de erro do HttpClient. */
export function toAppError(error: HttpErrorResponse): AppError {
  const body: ApiErrorBody =
    error.error && typeof error.error === 'object' ? (error.error as ApiErrorBody) : ({} as ApiErrorBody)

  const code = body.code ?? null
  const params = body.params ?? {}
  const message = resolveErrorMessage(code, params, body.message ?? error.message)

  return new AppError(message, code, params, error.status ?? 0)
}
