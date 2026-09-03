import { ApiPropertyOptional } from '@nestjs/swagger'
import { IsOptional, IsUUID } from 'class-validator'

import { PaginationQueryDto } from '@/common/dto/pagination-query.dto'

/** Query de listagem de aulas: paginação/busca + filtro por unidade. */
export class LessonQueryDto extends PaginationQueryDto {
  @ApiPropertyOptional({ format: 'uuid', description: 'Filtra aulas por unidade' })
  @IsOptional()
  @IsUUID()
  unitId?: string
}
