import type { BaseEntity } from '@app/core/models/api.model'

/** Curso: por enquanto só os campos herdados de BaseEntity (id, name, description). */
export type Course = BaseEntity

/** Payload de criação: sem id (gerado pela API) */
export type CreateCoursePayload = Omit<Course, 'id'>

/** Payload de atualização: tudo opcional (PATCH parcial) */
export type UpdateCoursePayload = Partial<CreateCoursePayload>
