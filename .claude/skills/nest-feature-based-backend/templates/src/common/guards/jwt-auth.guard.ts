import { ExecutionContext, Injectable } from '@nestjs/common'
import { Reflector } from '@nestjs/core'
import { AuthGuard } from '@nestjs/passport'

import { IS_PUBLIC_KEY } from '@/common/decorators/public.decorator'

/**
 * Guarda global de JWT (registrado em app.module.ts via APP_GUARD).
 * Protege TODAS as rotas por padrão — equivalente ao authGuard/ProtectedRoute
 * das skills de frontend, só que aplicado uma vez no backend em vez de rota
 * por rota. Endpoints marcados com @Public() (login, health) são liberados.
 */
@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  constructor(private readonly reflector: Reflector) {
    super()
  }

  canActivate(context: ExecutionContext) {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ])

    if (isPublic) return true

    return super.canActivate(context)
  }
}
