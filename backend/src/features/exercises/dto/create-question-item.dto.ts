import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'
import { IsOptional, IsString, IsUUID } from 'class-validator'

export class CreateQuestionItemDto {
  @ApiProperty({ example: 'Paris', description: 'Texto da alternativa' })
  @IsString()
  name!: string

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  description?: string

  @ApiProperty({ format: 'uuid', description: 'Pergunta à qual a alternativa pertence' })
  @IsUUID()
  questionId!: string
}
