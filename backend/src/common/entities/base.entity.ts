import { Column, CreateDateColumn, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm'

/**
 * Entidade base: toda entidade da aplicação estende esta classe pra ganhar
 * id (uuid), os campos de domínio comuns (name + description) e os
 * timestamps de auditoria sem repetir os decorators em cada feature.
 * Equivalente ao BaseEntity compartilhado nas skills de frontend
 * (core/models/api.model.ts).
 */
export abstract class BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id!: string

  @Column()
  name!: string

  /** Texto opcional — coluna nullable no banco. */
  @Column({ type: 'text', nullable: true })
  description!: string | null

  @CreateDateColumn({ name: 'created_at' })
  createdAt!: Date

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt!: Date
}
