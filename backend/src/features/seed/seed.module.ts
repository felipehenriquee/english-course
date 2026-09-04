import { Module } from '@nestjs/common'

import { UsersModule } from '@/features/users/users.module'
import { SeedService } from '@/features/seed/seed.service'

/**
 * Cria o usuário admin de desenvolvimento no boot (ver SeedService) — não
 * expõe controller nem é usado por outro módulo, só roda o `onModuleInit`.
 */
@Module({
  imports: [UsersModule],
  providers: [SeedService],
})
export class SeedModule {}
