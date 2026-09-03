import { ApiPropertyOptional } from '@nestjs/swagger'
import { IsOptional, IsUUID } from 'class-validator'

import { PaginationQueryDto } from '@/common/dto/pagination-query.dto'

/** Query de listagem de unidades: paginação/busca + filtro por curso. */
export class UnitQueryDto extends PaginationQueryDto {
  @ApiPropertyOptional({ format: 'uuid', description: 'Filtra unidades por curso' })
  @IsOptional()
  @IsUUID()
  courseId?: string
}
