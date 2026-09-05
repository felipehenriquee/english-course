import { ApiPropertyOptional } from '@nestjs/swagger'
import { IsOptional, IsUUID } from 'class-validator'

import { PaginationQueryDto } from '@/common/dto/pagination-query.dto'

/** Query de listagem de alternativas: paginação + filtro por pergunta. */
export class QuestionItemQueryDto extends PaginationQueryDto {
  @ApiPropertyOptional({ format: 'uuid', description: 'Filtra alternativas por pergunta' })
  @IsOptional()
  @IsUUID()
  questionId?: string
}
