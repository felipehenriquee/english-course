import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'
import { IsArray, IsIn, IsOptional, IsString, IsUUID, MaxLength } from 'class-validator'

import { QuestionType } from '@/features/exercises/entities/question.entity'

export class CreateQuestionDto {
  @ApiProperty({ example: 'Question 1' })
  @IsString()
  name!: string

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  description?: string

  @ApiProperty({ description: 'Enunciado em HTML (editor WYSIWYG), até 100 caracteres' })
  @IsString()
  @MaxLength(100)
  content!: string

  @ApiPropertyOptional({ enum: ['objective', 'subjective'], default: 'objective' })
  @IsOptional()
  @IsIn(['objective', 'subjective'])
  type?: QuestionType

  @ApiPropertyOptional({
    type: [String],
    description: 'Textos das alternativas — só usado quando type = "objective"',
  })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  items?: string[]

  @ApiProperty({ format: 'uuid', description: 'Exercício ao qual a pergunta pertence' })
  @IsUUID()
  exerciseId!: string
}
