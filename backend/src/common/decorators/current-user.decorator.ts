import { createParamDecorator, ExecutionContext } from '@nestjs/common'
import { Request } from 'express'
import type { AuthenticatedUser } from '@/common/types/authenticated-user.type'

/**
 * Extrai o usuário autenticado (populado pelo JwtStrategy) direto no
 * parâmetro do controller, sem precisar acessar `req.user` manualmente.
 *
 *   @Get('me')
 *   me(@CurrentUser() user: AuthenticatedUser) { ... }
 */
export const CurrentUser = createParamDecorator(
  (_data: unknown, ctx: ExecutionContext): AuthenticatedUser => {
    const request = ctx.switchToHttp().getRequest<Request & { user: AuthenticatedUser }>()
    return request.user
  },
)
