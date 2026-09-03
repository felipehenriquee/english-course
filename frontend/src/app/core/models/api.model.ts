/**
 * Contrato base de toda entidade CRUD: id + os campos de domínio comuns
 * (name obrigatório, description opcional). Espelha o BaseEntity do backend
 * (common/entities/base.entity.ts).
 */
export interface BaseEntity {
  id: string | number
  name: string
  description?: string
}

/** Formato de resposta paginada, comum em listagens de API REST. */
export interface PaginatedResponse<T> {
  data: T[]
  total: number
  page: number
  perPage: number
}

/** Query params aceitos por getAll (filtros, paginação, ordenação, busca). */
export interface QueryParams {
  page?: number
  perPage?: number
  sort?: string
  search?: string
  [key: string]: string | number | boolean | undefined
}
