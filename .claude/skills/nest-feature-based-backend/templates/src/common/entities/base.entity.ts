import { CreateDateColumn, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm'

/**
 * Entidade base: toda entidade da aplicação estende esta classe pra ganhar
 * id (uuid) + timestamps de auditoria sem repetir os decorators em cada
 * feature. Equivalente ao BaseEntity/interface compartilhada nas skills de
 * frontend (types/api.ts).
 */
export abstract class BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id!: string

  @CreateDateColumn({ name: 'created_at' })
  createdAt!: Date

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt!: Date
}
