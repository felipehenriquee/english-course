import { ApiPropertyOptional } from '@nestjs/swagger'
import { IsOptional, IsUUID } from 'class-validator'

import { PaginationQueryDto } from '@/common/dto/pagination-query.dto'

/** Query de listagem de respostas: paginação + filtro por pergunta/aluno. */
export class StudentAnswerQueryDto extends PaginationQueryDto {
  @ApiPropertyOptional({ format: 'uuid', description: 'Filtra respostas por pergunta' })
  @IsOptional()
  @IsUUID()
  questionId?: string

  @ApiPropertyOptional({ format: 'uuid', description: 'Filtra respostas por aluno' })
  @IsOptional()
  @IsUUID()
  userId?: string
}
