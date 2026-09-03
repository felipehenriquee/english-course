import { ApiProperty } from '@nestjs/swagger'

/**
 * Formato de resposta paginada devolvido por BaseService.getAll().
 * Mesmo formato (data/total/page/perPage) esperado pelo PaginatedResponse<T>
 * das 3 skills de frontend (types/api.ts) — o front já sabe ler isso direto.
 */
export class PaginatedResponseDto<T> {
  @ApiProperty({ isArray: true })
  data: T[]

  @ApiProperty()
  total: number

  @ApiProperty()
  page: number

  @ApiProperty()
  perPage: number

  constructor(data: T[], total: number, page: number, perPage: number) {
    this.data = data
    this.total = total
    this.page = page
    this.perPage = perPage
  }
}
