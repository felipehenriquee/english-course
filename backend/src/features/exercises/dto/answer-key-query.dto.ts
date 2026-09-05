import { ApiPropertyOptional } from '@nestjs/swagger'
import { IsOptional, IsUUID } from 'class-validator'

import { PaginationQueryDto } from '@/common/dto/pagination-query.dto'

/** Query de listagem de gabaritos: paginação + filtro por pergunta. */
export class AnswerKeyQueryDto extends PaginationQueryDto {
  @ApiPropertyOptional({ format: 'uuid', description: 'Filtra gabaritos por pergunta' })
  @IsOptional()
  @IsUUID()
  questionId?: string
}
