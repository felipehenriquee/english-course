import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'

import { Unit } from '@/features/units/entities/unit.entity'
import { UnitsController } from '@/features/units/units.controller'
import { UnitsService } from '@/features/units/units.service'

@Module({
  imports: [TypeOrmModule.forFeature([Unit])],
  controllers: [UnitsController],
  providers: [UnitsService],
})
export class UnitsModule {}
