import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'
import { IsBoolean, IsOptional, IsString, IsUUID } from 'class-validator'

export class CreateStudentAnswerDto {
  @ApiProperty({ format: 'uuid', description: 'Pergunta respondida' })
  @IsUUID()
  questionId!: string

  @ApiProperty({ format: 'uuid', description: 'Aluno que respondeu' })
  @IsUUID()
  userId!: string

  @ApiPropertyOptional({ format: 'uuid', description: 'Alternativa escolhida (pergunta objetiva)' })
  @IsOptional()
  @IsUUID()
  selectedItemId?: string

  @ApiPropertyOptional({ description: 'Resposta dissertativa (pergunta não objetiva)' })
  @IsOptional()
  @IsString()
  answerText?: string

  @ApiPropertyOptional({ default: false })
  @IsOptional()
  @IsBoolean()
  answered?: boolean
}
