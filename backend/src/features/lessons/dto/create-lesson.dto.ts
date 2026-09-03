import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'
import { IsOptional, IsString, IsUUID } from 'class-validator'

export class CreateLessonDto {
  @ApiProperty({ example: 'Lesson 1 — Saying hello' })
  @IsString()
  name!: string

  @ApiPropertyOptional({ example: 'Hi / Hello / Good morning.' })
  @IsOptional()
  @IsString()
  description?: string

  @ApiPropertyOptional({ description: 'Conteúdo completo da aula em HTML (editor WYSIWYG)' })
  @IsOptional()
  @IsString()
  content?: string

  @ApiProperty({ format: 'uuid', description: 'Unidade à qual a aula pertence' })
  @IsUUID()
  unitId!: string
}
