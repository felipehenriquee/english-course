import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common'
import { Request, Response } from 'express'

/**
 * Filtro global de exceções: garante que TODO erro (HttpException do Nest
 * ou erro não tratado) saia no mesmo formato JSON, com a mensagem
 * normalizada em `message` — é exatamente o campo que o interceptor de
 * resposta do Axios lê em `error.response?.data?.message` nas 3 skills de
 * frontend (lib/http.ts / services/http.ts).
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
    const message = this.extractMessage(exceptionResponse, exception)

    if (!isHttpException) {
      this.logger.error(exception instanceof Error ? exception.stack : exception)
    }

    response.status(status).json({
      statusCode: status,
      message,
      path: request.url,
      timestamp: new Date().toISOString(),
    })
  }

  private extractMessage(exceptionResponse: unknown, exception: unknown): string {
    if (typeof exceptionResponse === 'string') return exceptionResponse

    if (
      exceptionResponse &&
      typeof exceptionResponse === 'object' &&
      'message' in exceptionResponse
    ) {
      const { message } = exceptionResponse as { message: string | string[] }
      return Array.isArray(message) ? message.join(', ') : message
    }

    return exception instanceof Error ? exception.message : 'Erro interno inesperado'
  }
}
