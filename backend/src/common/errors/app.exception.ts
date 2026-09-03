import {
  BadRequestException,
  ConflictException,
  ForbiddenException,
  HttpException,
  HttpStatus,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common'

import { ErrorCode, ErrorParams, resolveErrorMessage } from '@/common/errors/error-messages'

/**
 * Corpo padronizado que vai DENTRO de toda exceção de domínio e acaba no
 * JSON de resposta (ver http-exception.filter.ts):
 *
 *   { "code": "not_found", "params": { "entity": "Usuário" }, "message": "Usuário não encontrado" }
 *
 * O front usa `code` + `params` pra montar a mensagem no idioma dele;
 * `message` é o fallback já resolvido em PT.
 */
export interface AppErrorBody {
  code: ErrorCode
  params: ErrorParams
  message: string
}

export function buildErrorBody(code: ErrorCode, params: ErrorParams = {}): AppErrorBody {
  return { code, params, message: resolveErrorMessage(code, params) }
}

/**
 * Exceção genérica: use quando precisar de um `code` + status HTTP que não
 * têm um atalho abaixo. Para os casos comuns, prefira as subclasses
 * (NotFoundError, ConflictError, ...), que já fixam o status certo.
 *
 *   throw new AppException('validation_error', HttpStatus.UNPROCESSABLE_ENTITY, { details: '...' })
 */
export class AppException extends HttpException {
  readonly code: ErrorCode
  readonly params: ErrorParams

  constructor(code: ErrorCode, status: HttpStatus, params: ErrorParams = {}) {
    super(buildErrorBody(code, params), status)
    this.code = code
    this.params = params
  }
}

/* --------------------------------------------------------------------------
 * Atalhos por status HTTP.
 *
 * Estendem as exceções nativas do Nest (mantém `instanceof NotFoundException`
 * etc. funcionando em testes/guards/filters), mas com o corpo estruturado
 * `{ code, params, message }` no lugar da string solta.
 * ------------------------------------------------------------------------ */

export class NotFoundError extends NotFoundException {
  readonly code: ErrorCode = 'not_found'
  readonly params: ErrorParams

  /**
   * @param entity nome de exibição da entidade que não foi encontrada
   *   (preenche o `{{entity}}` do template).
   * @param params params extras (ex: `{ id }`) para templates customizados.
   */
  constructor(entity: string, params: ErrorParams = {}) {
    const merged: ErrorParams = { entity, ...params }
    super(buildErrorBody('not_found', merged))
    this.params = merged
  }
}

export class ConflictError extends ConflictException {
  readonly code: ErrorCode
  readonly params: ErrorParams

  constructor(code: ErrorCode = 'already_exists', params: ErrorParams = {}) {
    super(buildErrorBody(code, params))
    this.code = code
    this.params = params
  }
}

export class UnauthorizedError extends UnauthorizedException {
  readonly code: ErrorCode
  readonly params: ErrorParams

  constructor(code: ErrorCode = 'invalid_credentials', params: ErrorParams = {}) {
    super(buildErrorBody(code, params))
    this.code = code
    this.params = params
  }
}

export class ForbiddenError extends ForbiddenException {
  readonly code: ErrorCode
  readonly params: ErrorParams

  constructor(code: ErrorCode = 'forbidden', params: ErrorParams = {}) {
    super(buildErrorBody(code, params))
    this.code = code
    this.params = params
  }
}

export class BadRequestError extends BadRequestException {
  readonly code: ErrorCode
  readonly params: ErrorParams

  constructor(code: ErrorCode = 'validation_error', params: ErrorParams = {}) {
    super(buildErrorBody(code, params))
    this.code = code
    this.params = params
  }
}
