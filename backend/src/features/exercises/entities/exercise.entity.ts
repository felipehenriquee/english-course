import { Column, Entity, JoinColumn, ManyToOne, OneToMany, OneToOne } from 'typeorm'

import { BaseEntity } from '@/common/entities/base.entity'
import { Lesson } from '@/features/lessons/entities/lesson.entity'
import { Question } from '@/features/exercises/entities/question.entity'

/**
 * Exercício de uma aula do tipo "exercise". name/description herdados de
 * BaseEntity + o vínculo 1:1 com a Lesson. Apagar a Lesson apaga o
 * Exercise (CASCADE).
 */
@Entity('exercises')
export class Exercise extends BaseEntity {
  @OneToOne(() => Lesson, (lesson) => lesson.exercise, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'lesson_id' })
  lesson!: Lesson

  @Column({ name: 'lesson_id', type: 'varchar', length: 36, unique: true })
  lessonId!: string

  /**
   * Aula de CONTEÚDO à qual este exercício se refere (ex: o exercício testa
   * o que foi ensinado nessa aula). Opcional, e independente da Lesson dona
   * do exercício (`lesson`, que é do tipo "exercise") — se a aula de
   * referência for apagada, só desfaz o vínculo (SET NULL).
   */
  @ManyToOne(() => Lesson, { nullable: true, onDelete: 'SET NULL' })
  @JoinColumn({ name: 'reference_lesson_id' })
  referenceLesson?: Lesson

  @Column({ name: 'reference_lesson_id', type: 'varchar', length: 36, nullable: true })
  referenceLessonId!: string | null

  /** Conteúdo/instruções do exercício em HTML (editor WYSIWYG). */
  @Column({ type: 'text', nullable: true })
  content!: string | null

  /** Pontuação total do exercício. */
  @Column({ type: 'int', default: 0 })
  score!: number

  @OneToMany(() => Question, (question) => question.exercise)
  questions!: Question[]
}
