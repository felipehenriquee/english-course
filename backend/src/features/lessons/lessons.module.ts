import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'

import { Lesson } from '@/features/lessons/entities/lesson.entity'
import { LessonsController } from '@/features/lessons/lessons.controller'
import { LessonsService } from '@/features/lessons/lessons.service'

@Module({
  imports: [TypeOrmModule.forFeature([Lesson])],
  controllers: [LessonsController],
  providers: [LessonsService],
})
export class LessonsModule {}
