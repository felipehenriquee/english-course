import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'

import { User } from '@/features/users/entities/user.entity'
import { UsersController } from '@/features/users/users.controller'
import { UsersService } from '@/features/users/users.service'

@Module({
  imports: [TypeOrmModule.forFeature([User])],
  controllers: [UsersController],
  providers: [UsersService],
  // Exportado porque o AuthModule usa UsersService (findByEmail, create) no login/registro.
  exports: [UsersService],
})
export class UsersModule {}
