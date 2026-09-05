import { PartialType } from '@nestjs/swagger'

import { CreateQuestionItemDto } from '@/features/exercises/dto/create-question-item.dto'

/** Todos os campos de CreateQuestionItemDto viram opcionais (PATCH parcial). */
export class UpdateQuestionItemDto extends PartialType(CreateQuestionItemDto) {}
