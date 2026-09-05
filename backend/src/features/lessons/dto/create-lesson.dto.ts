import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'
import { IsIn, IsOptional, IsString, IsUUID } from 'class-validator'

import { LessonType } from '@/features/lessons/entities/lesson.entity'

export class CreateLessonDto {
  @ApiProperty({ example: 'Lesson 1 — Saying hello' })
  @IsString()
  name!: string

  @ApiPropertyOptional({ example: 'Hi / Hello / Good morning.' })
  @IsOptional()
  @IsString()
  description?: string

  @ApiPropertyOptional({ enum: ['content', 'exercise'], default: 'content' })
  @IsOptional()
  @IsIn(['content', 'exercise'])
  type?: LessonType

  @ApiPropertyOptional({ description: 'Conteúdo completo da aula em HTML (editor WYSIWYG)' })
  @IsOptional()
  @IsString()
  content?: string

  @ApiProperty({ format: 'uuid', description: 'Unidade à qual a aula pertence' })
  @IsUUID()
  unitId!: string
}
