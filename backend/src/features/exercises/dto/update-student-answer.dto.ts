import { PartialType } from '@nestjs/swagger'

import { CreateStudentAnswerDto } from '@/features/exercises/dto/create-student-answer.dto'

/** Todos os campos de CreateStudentAnswerDto viram opcionais (PATCH parcial). */
export class UpdateStudentAnswerDto extends PartialType(CreateStudentAnswerDto) {}
