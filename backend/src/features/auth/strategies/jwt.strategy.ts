import { Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { PassportStrategy } from '@nestjs/passport'
import { ExtractJwt, Strategy } from 'passport-jwt'

import type { AuthenticatedUser } from '@/common/types/authenticated-user.type'

export interface JwtPayload {
  sub: string
  email: string
  role: string
}

/**
 * Estratégia Passport que valida o Bearer token em toda requisição
 * protegida (ver common/guards/jwt-auth.guard.ts). O retorno de `validate`
 * vira `req.user`, lido pelo decorator @CurrentUser().
 */
@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(config: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: config.get<string>('JWT_SECRET', 'troque-este-valor-em-producao'),
    })
  }

  validate(payload: JwtPayload): AuthenticatedUser {
    return { id: payload.sub, email: payload.email, role: payload.role }
  }
}
