import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'
import { IsOptional, IsString, IsUUID } from 'class-validator'

export class CreateUnitDto {
  @ApiProperty({ example: 'Unit 1 — Greetings' })
  @IsString()
  name!: string

  @ApiPropertyOptional({ example: 'Saudações e apresentações.' })
  @IsOptional()
  @IsString()
  description?: string

  @ApiProperty({ format: 'uuid', description: 'Curso ao qual a unidade pertence' })
  @IsUUID()
  courseId!: string
}
