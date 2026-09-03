import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm'

import { BaseEntity } from '@/common/entities/base.entity'
import { Course } from '@/features/courses/entities/course.entity'

/**
 * Unidade de um curso — o "módulo" do domínio, renomeado para `Unit` para
 * não colidir com "module" de código (NestJS module, ES module...).
 *
 * Campos: name/description herdados de BaseEntity + o vínculo com o Course.
 * Um Course tem várias Units; apagar o Course apaga suas Units (CASCADE).
 */
@Entity('units')
export class Unit extends BaseEntity {
  @ManyToOne(() => Course, (course) => course.units, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'course_id' })
  course!: Course

  @Column({ name: 'course_id', type: 'varchar', length: 36 })
  courseId!: string
}
