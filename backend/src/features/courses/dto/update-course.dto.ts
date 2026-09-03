import { PartialType } from '@nestjs/swagger'

import { CreateCourseDto } from '@/features/courses/dto/create-course.dto'

/** Todos os campos de CreateCourseDto viram opcionais (PATCH parcial). */
export class UpdateCourseDto extends PartialType(CreateCourseDto) {}
