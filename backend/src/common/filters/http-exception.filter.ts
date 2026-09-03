import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common'
import { Request, Response } from 'express'

import { ErrorParams } from '@/common/errors'

/**
 * Filtro global de exceções: garante que TODO erro (HttpException do Nest
 * ou erro não tratado) saia no mesmo formato JSON.
 *
 * Formato:
 *   {
 *     "statusCode": 404,
 *     "code": "not_found",              // null quando o erro não tem code de domínio
 *     "params": { "entity": "Usuário" },
 *     "message": "Usuário não encontrado",
 *     "path": "/api/users/123",
 *     "timestamp": "2026-09-03T12:00:00.000Z"
 *   }
 *
 * `code` + `params` vêm das exceções de domínio (common/errors/app.exception.ts)
 * e são o que o front usa pra montar a mensagem no idioma dele; `message` é o
 * fallback já resolvido em PT (também é o campo lido pelo error.interceptor do
 * frontend quando não reconhece o `code`).
 */
@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(HttpExceptionFilter.name)

  catch(exception: unknown, host: ArgumentsHost): void {
    const ctx = host.switchToHttp()
    const response = ctx.getResponse<Response>()
    const request = ctx.getRequest<Request>()

    const isHttpException = exception instanceof HttpException
    const status = isHttpException ? exception.getStatus() : HttpStatus.INTERNAL_SERVER_ERROR

    const exceptionResponse = isHttpException ? exception.getResponse() : null
    const { message, code, params } = this.extractError(
      exceptionResponse,
      exception,
      isHttpException,
    )

    if (!isHttpException) {
      this.logger.error(exception instanceof Error ? exception.stack : exception)
    }

    response.status(status).json({
      statusCode: status,
      code,
      params,
      message,
      path: request.url,
      timestamp: new Date().toISOString(),
    })
  }

  private extractError(
    exceptionResponse: unknown,
    exception: unknown,
    isHttpException: boolean,
  ): { message: string; code: string | null; params: ErrorParams } {
    if (typeof exceptionResponse === 'string') {
      return { message: exceptionResponse, code: null, params: {} }
    }

    if (exceptionResponse && typeof exceptionResponse === 'object') {
      const body = exceptionResponse as {
        message?: string | string[]
        error?: string
        code?: string
        params?: ErrorParams
      }
      const rawMessage = body.message ?? body.error ?? 'Erro inesperado'
      return {
        message: Array.isArray(rawMessage) ? rawMessage.join(', ') : rawMessage,
        code: body.code ?? null,
        params: body.params ?? {},
      }
    }

    // Erro não tratado (não é HttpException): não vaza o detalhe interno.
    return {
      message: 'Erro interno inesperado',
      code: isHttpException ? null : 'internal_error',
      params: {},
    }
  }
}
