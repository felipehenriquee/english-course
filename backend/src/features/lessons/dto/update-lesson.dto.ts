import { PartialType } from '@nestjs/swagger'

import { CreateLessonDto } from '@/features/lessons/dto/create-lesson.dto'

/** Todos os campos de CreateLessonDto viram opcionais (PATCH parcial). */
export class UpdateLessonDto extends PartialType(CreateLessonDto) {}
