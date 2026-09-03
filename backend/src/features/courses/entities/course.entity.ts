import { Entity, OneToMany } from 'typeorm'

import { BaseEntity } from '@/common/entities/base.entity'
import { Unit } from '@/features/units/entities/unit.entity'

/**
 * Curso do catálogo. name/description vêm de BaseEntity; um curso tem
 * várias unidades (Unit).
 */
@Entity('courses')
export class Course extends BaseEntity {
  @OneToMany(() => Unit, (unit) => unit.course)
  units!: Unit[]

  /**
   * Nº de unidades do curso. Não é coluna — preenchido por
   * `loadRelationCountAndMap` no CoursesService e enviado no JSON da API.
   */
  unitsCount?: number
}
