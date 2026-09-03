import { Module } from '@nestjs/common'
import { APP_GUARD } from '@nestjs/core'
import { ConfigModule, ConfigService } from '@nestjs/config'
import { TypeOrmModule } from '@nestjs/typeorm'
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler'

import { buildTypeOrmConfig } from '@/config/typeorm.config'
import { JwtAuthGuard } from '@/common/guards/jwt-auth.guard'
import { AuthModule } from '@/features/auth/auth.module'
import { UsersModule } from '@/features/users/users.module'
import { HealthModule } from '@/features/health/health.module'

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),

    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: buildTypeOrmConfig,
    }),

    ThrottlerModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        throttlers: [
          {
            ttl: config.get<number>('THROTTLE_TTL', 60000),
            limit: config.get<number>('THROTTLE_LIMIT', 100),
          },
        ],
      }),
    }),

    // Módulos de feature (feature-based, um por recurso/domínio).
    // Nova feature? Crie a pasta em src/features/<feature>/ e importe aqui.
    AuthModule,
    UsersModule,
    HealthModule,
  ],
  providers: [
    // JwtAuthGuard global: toda rota exige token, exceto as marcadas com @Public().
    { provide: APP_GUARD, useClass: JwtAuthGuard },
    // Rate limiting global (ver .env -> THROTTLE_TTL/THROTTLE_LIMIT).
    { provide: APP_GUARD, useClass: ThrottlerGuard },
  ],
})
export class AppModule {}
