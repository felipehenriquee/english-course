import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'
import { IsInt, IsOptional, IsString, IsUUID, Min } from 'class-validator'

export class CreateExerciseDto {
  @ApiProperty({ example: 'Exercise 1 — Present tense' })
  @IsString()
  name!: string

  @ApiPropertyOptional({ example: 'Perguntas sobre o presente simples.' })
  @IsOptional()
  @IsString()
  description?: string

  @ApiPropertyOptional({ description: 'Instruções do exercício em HTML (editor WYSIWYG)' })
  @IsOptional()
  @IsString()
  content?: string

  @ApiPropertyOptional({ default: 0, description: 'Pontuação total do exercício' })
  @IsOptional()
  @IsInt()
  @Min(0)
  score?: number

  @ApiProperty({ format: 'uuid', description: 'Aula (do tipo exercise) à qual pertence' })
  @IsUUID()
  lessonId!: string

  @ApiPropertyOptional({
    format: 'uuid',
    description: 'Aula de conteúdo à qual este exercício se refere',
  })
  @IsOptional()
  @IsUUID()
  referenceLessonId?: string
}
