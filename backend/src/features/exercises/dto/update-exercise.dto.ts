import { PartialType } from '@nestjs/swagger'

import { CreateExerciseDto } from '@/features/exercises/dto/create-exercise.dto'

/** Todos os campos de CreateExerciseDto viram opcionais (PATCH parcial). */
export class UpdateExerciseDto extends PartialType(CreateExerciseDto) {}
