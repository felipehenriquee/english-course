import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm'

import { BaseEntity } from '@/common/entities/base.entity'
import { Question } from '@/features/exercises/entities/question.entity'

/**
 * Alternativa de uma Question objetiva. O texto da alternativa é o próprio
 * `name` herdado de BaseEntity — não precisa de um campo extra. Apagar a
 * Question apaga seus itens (CASCADE).
 */
@Entity('question_items')
export class QuestionItem extends BaseEntity {
  @ManyToOne(() => Question, (question) => question.items, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'question_id' })
  question!: Question

  @Column({ name: 'question_id', type: 'varchar', length: 36 })
  questionId!: string
}
