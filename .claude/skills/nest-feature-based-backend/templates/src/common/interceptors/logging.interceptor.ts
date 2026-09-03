import { CallHandler, ExecutionContext, Injectable, Logger, NestInterceptor } from '@nestjs/common'
import { Request, Response } from 'express'
import { Observable, tap } from 'rxjs'

/**
 * Loga método, rota, status e tempo de resposta de cada requisição.
 * Registrado globalmente em main.ts.
 */
@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  private readonly logger = new Logger('HTTP')

  intercept(context: ExecutionContext, next: CallHandler): Observable<unknown> {
    const request = context.switchToHttp().getRequest<Request>()
    const response = context.switchToHttp().getResponse<Response>()
    const { method, originalUrl } = request
    const start = Date.now()

    return next.handle().pipe(
      tap(() => {
        const ms = Date.now() - start
        this.logger.log(`${method} ${originalUrl} ${response.statusCode} +${ms}ms`)
      }),
    )
  }
}
