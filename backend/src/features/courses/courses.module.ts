import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'

import { Course } from '@/features/courses/entities/course.entity'
import { CoursesController } from '@/features/courses/courses.controller'
import { CoursesService } from '@/features/courses/courses.service'

@Module({
  imports: [TypeOrmModule.forFeature([Course])],
  controllers: [CoursesController],
  providers: [CoursesService],
})
export class CoursesModule {}
