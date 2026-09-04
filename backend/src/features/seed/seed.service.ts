import { Injectable, Logger, OnModuleInit } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'

import { UsersService } from '@/features/users/users.service'

const DEV_ADMIN_EMAIL = 'admin@sapo.local'
const DEV_ADMIN_PASSWORD = 'admin123'

/**
 * Fora de produção, garante que existe um usuário admin
 * (admin@sapo.local / admin123) pra logar num boot local novo sem precisar
 * registrar na mão. Idempotente: só cria se `findByEmail` não achar ninguém.
 */
@Injectable()
export class SeedService implements OnModuleInit {
  private readonly logger = new Logger(SeedService.name)

  constructor(
    private readonly usersService: UsersService,
    private readonly config: ConfigService,
  ) {}

  async onModuleInit(): Promise<void> {
    if (this.config.get<string>('NODE_ENV', 'development') === 'production') return

    const existing = await this.usersService.findByEmail(DEV_ADMIN_EMAIL)
    if (existing) return

    await this.usersService.create({
      name: 'Admin',
      email: DEV_ADMIN_EMAIL,
      password: DEV_ADMIN_PASSWORD,
      role: 'admin',
      active: true,
    })
    this.logger.log(
      `Usuário admin de desenvolvimento criado: ${DEV_ADMIN_EMAIL} / ${DEV_ADMIN_PASSWORD}`,
    )
  }
}
