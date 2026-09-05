import { Column, Entity, JoinColumn, ManyToOne, OneToMany } from 'typeorm'

import { BaseEntity } from '@/common/entities/base.entity'
import { Exercise } from '@/features/exercises/entities/exercise.entity'
import { QuestionItem } from '@/features/exercises/entities/question-item.entity'

export type QuestionType = 'objective' | 'subjective'

/**
 * Pergunta de um Exercise. name/description herdados de BaseEntity +
 * `content` (o enunciado, capado em 100 chars) + `type`. Apagar o Exercise
 * apaga suas Questions (CASCADE).
 *
 * A resposta certa NÃO fica aqui — ver `AnswerKey`, tabela isolada de
 * propósito pra nunca ser devolvida junto com a pergunta.
 */
@Entity('questions')
export class Question extends BaseEntity {
  @ManyToOne(() => Exercise, (exercise) => exercise.questions, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'exercise_id' })
  exercise!: Exercise

  @Column({ name: 'exercise_id', type: 'varchar', length: 36 })
  exerciseId!: string

  /** Enunciado da pergunta em HTML (editor WYSIWYG), até 100 caracteres. */
  @Column({ type: 'varchar', length: 100 })
  content!: string

  @Column({ type: 'varchar', default: 'objective' })
  type!: QuestionType

  /** Alternativas — só relevante quando `type === 'objective'`. */
  @OneToMany(() => QuestionItem, (item) => item.question)
  items!: QuestionItem[]
}
