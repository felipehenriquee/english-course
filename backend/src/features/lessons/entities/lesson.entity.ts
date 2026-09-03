import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm'

import { BaseEntity } from '@/common/entities/base.entity'
import { Unit } from '@/features/units/entities/unit.entity'

/**
 * Aula (lesson) de uma unidade. name/description herdados de BaseEntity +
 * o vínculo com a Unit. Uma Unit tem várias Lessons; apagar a Unit apaga
 * suas Lessons (CASCADE).
 */
@Entity('lessons')
export class Lesson extends BaseEntity {
  @ManyToOne(() => Unit, (unit) => unit.lessons, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'unit_id' })
  unit!: Unit

  @Column({ name: 'unit_id', type: 'varchar', length: 36 })
  unitId!: string

  /**
   * Conteúdo completo da aula em HTML, gerado pelo editor WYSIWYG (Quill)
   * do frontend e exibido na página da aula. Não vem nas listagens
   * (`LessonsService.getAll` seleciona só os campos leves) — só no getById.
   */
  @Column({ type: 'text', nullable: true })
  content!: string | null
}
