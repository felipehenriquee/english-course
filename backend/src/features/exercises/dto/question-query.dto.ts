import { ApiPropertyOptional } from '@nestjs/swagger'
import { IsOptional, IsUUID } from 'class-validator'

import { PaginationQueryDto } from '@/common/dto/pagination-query.dto'

/** Query de listagem de perguntas: paginação/busca + filtro por exercício. */
export class QuestionQueryDto extends PaginationQueryDto {
  @ApiPropertyOptional({ format: 'uuid', description: 'Filtra perguntas por exercício' })
  @IsOptional()
  @IsUUID()
  exerciseId?: string
}
