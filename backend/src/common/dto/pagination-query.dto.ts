import { Type } from 'class-transformer'
import { IsIn, IsInt, IsOptional, IsString, Max, Min } from 'class-validator'
import { ApiPropertyOptional } from '@nestjs/swagger'

/**
 * Query params aceitos por qualquer endpoint de listagem (GET /recurso).
 * Usado pelo BaseService.getAll(). Equivalente ao QueryParams das skills de
 * frontend (types/api.ts).
 */
export class PaginationQueryDto {
  @ApiPropertyOptional({ default: 1, minimum: 1 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page: number = 1

  @ApiPropertyOptional({ default: 20, minimum: 1, maximum: 100 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(100)
  perPage: number = 20

  @ApiPropertyOptional({ description: 'Campo de ordenação, ex: "name" ou "-createdAt"' })
  @IsOptional()
  @IsString()
  sort?: string

  @ApiPropertyOptional({ description: 'Busca livre (aplicada pela feature, se suportado)' })
  @IsOptional()
  @IsString()
  search?: string

  @ApiPropertyOptional({ enum: ['ASC', 'DESC'] })
  @IsOptional()
  @IsIn(['ASC', 'DESC'])
  order?: 'ASC' | 'DESC'
}
