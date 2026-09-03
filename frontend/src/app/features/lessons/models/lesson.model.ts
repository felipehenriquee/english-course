import type { BaseEntity } from '@app/core/models/api.model'

/** Aula de uma unidade. name/description herdados de BaseEntity. */
export interface Lesson extends BaseEntity {
  unitId: string
  /**
   * Conteúdo completo da aula em HTML (editor WYSIWYG). Só presente na
   * resposta de getById — as listagens não trazem este campo.
   */
  content?: string | null
}

/** Payload de criação: sem id (gerado pela API). */
export type CreateLessonPayload = Omit<Lesson, 'id'>

/** Payload de atualização: tudo opcional (PATCH parcial). */
export type UpdateLessonPayload = Partial<CreateLessonPayload>
