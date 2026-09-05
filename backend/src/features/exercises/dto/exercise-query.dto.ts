import { ApiPropertyOptional } from '@nestjs/swagger'
import { IsOptional, IsUUID } from 'class-validator'

import { PaginationQueryDto } from '@/common/dto/pagination-query.dto'

/** Query de listagem de exercícios: paginação/busca + filtro por aula. */
export class ExerciseQueryDto extends PaginationQueryDto {
  @ApiPropertyOptional({ format: 'uuid', description: 'Filtra exercícios por aula' })
  @IsOptional()
  @IsUUID()
  lessonId?: string
}
