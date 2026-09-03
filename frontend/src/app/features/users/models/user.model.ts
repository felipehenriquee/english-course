import type { BaseEntity } from '@app/core/models/api.model'

export interface User extends BaseEntity {
  name: string
  email: string
  role: 'admin' | 'editor' | 'viewer'
  active: boolean
}

/** Payload de criação: sem id (gerado pela API) */
export type CreateUserPayload = Omit<User, 'id'>

/** Payload de atualização: tudo opcional (PATCH parcial) */
export type UpdateUserPayload = Partial<CreateUserPayload>
