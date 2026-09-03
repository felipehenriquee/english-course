import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'
import { IsOptional, IsString } from 'class-validator'

export class CreateCourseDto {
  @ApiProperty({ example: 'English for Beginners' })
  @IsString()
  name!: string

  @ApiPropertyOptional({ example: 'Curso introdutório de inglês (nível A1/A2).' })
  @IsOptional()
  @IsString()
  description?: string
}
