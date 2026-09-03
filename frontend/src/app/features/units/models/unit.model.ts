import type { BaseEntity } from '@app/core/models/api.model'

/** Referência enxuta de uma aula (só id + nome), como vem no getById da unidade. */
export interface UnitLessonRef {
  id: string
  name: string
}

/** Unidade (módulo) de um curso. name/description herdados de BaseEntity. */
export interface Unit extends BaseEntity {
  courseId: string
  /** Nº de aulas. Presente na resposta de getById. */
  lessonsCount?: number
  /** Aulas da unidade (id + nome). Só presente na resposta de getById. */
  lessons?: UnitLessonRef[]
}

/** Payload de criação: sem id nem campos derivados. */
export type CreateUnitPayload = Omit<Unit, 'id' | 'lessonsCount' | 'lessons'>

/** Payload de atualização: tudo opcional (PATCH parcial). */
export type UpdateUnitPayload = Partial<CreateUnitPayload>
