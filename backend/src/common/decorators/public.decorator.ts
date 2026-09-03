import { SetMetadata } from '@nestjs/common'

export const IS_PUBLIC_KEY = 'isPublic'

/**
 * Marca um endpoint como público, liberando-o do JwtAuthGuard global
 * (ver app.module.ts -> APP_GUARD e common/guards/jwt-auth.guard.ts).
 * Use em login/register e qualquer rota que não exija sessão.
 *
 *   @Public()
 *   @Post('login')
 *   login(...) { ... }
 */
export const Public = () => SetMetadata(IS_PUBLIC_KEY, true)
