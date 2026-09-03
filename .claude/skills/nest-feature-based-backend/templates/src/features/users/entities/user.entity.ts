import { Column, Entity, Index } from 'typeorm'
import { Exclude } from 'class-transformer'

import { BaseEntity } from '@/common/entities/base.entity'

export type UserRole = 'admin' | 'editor' | 'viewer'

/**
 * Mesma entidade "User" que as 3 skills de frontend já modelam em
 * features/users/types/user.ts (name, email, role, active) — o
 * contrato de API fica simétrico dos dois lados.
 */
@Entity('users')
export class User extends BaseEntity {
  @Column()
  name!: string

  @Index({ unique: true })
  @Column()
  email!: string

  /** Hash bcrypt. Nunca retorna no JSON de resposta (ver @Exclude). */
  @Column()
  @Exclude()
  password!: string

  @Column({ type: 'varchar', default: 'viewer' })
  role!: UserRole

  @Column({ default: true })
  active!: boolean
}
