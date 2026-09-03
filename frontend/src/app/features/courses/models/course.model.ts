import type { BaseEntity } from '@app/core/models/api.model'

/** Referência enxuta de uma unidade (só id + nome), como vem no getById do curso. */
export interface CourseUnitRef {
  id: string
  name: string
}

export interface Course extends BaseEntity {
  /** Nº de unidades (módulos) do curso — enviado pela API. */
  unitsCount: number
  /** Unidades do curso (id + nome). Só presente na resposta de getById. */
  units?: CourseUnitRef[]
}

/** Payload de criação: sem id nem campos calculados/derivados. */
export type CreateCoursePayload = Omit<Course, 'id' | 'unitsCount' | 'units'>

/** Payload de atualização: tudo opcional (PATCH parcial). */
export type UpdateCoursePayload = Partial<CreateCoursePayload>
