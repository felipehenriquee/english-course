import type { BaseEntity } from '@app/core/models/api.model'

/** Unidade (módulo) de um curso. name/description herdados de BaseEntity. */
export interface Unit extends BaseEntity {
  courseId: string
}

/** Payload de criação: sem id (gerado pela API). */
export type CreateUnitPayload = Omit<Unit, 'id'>

/** Payload de atualização: tudo opcional (PATCH parcial). */
export type UpdateUnitPayload = Partial<CreateUnitPayload>
