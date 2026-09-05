import { PartialType } from '@nestjs/swagger'

import { CreateQuestionDto } from '@/features/exercises/dto/create-question.dto'

/** Todos os campos de CreateQuestionDto viram opcionais (PATCH parcial). */
export class UpdateQuestionDto extends PartialType(CreateQuestionDto) {}
