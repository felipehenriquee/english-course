import { PartialType } from '@nestjs/swagger'

import { CreateAnswerKeyDto } from '@/features/exercises/dto/create-answer-key.dto'

/** Todos os campos de CreateAnswerKeyDto viram opcionais (PATCH parcial). */
export class UpdateAnswerKeyDto extends PartialType(CreateAnswerKeyDto) {}
