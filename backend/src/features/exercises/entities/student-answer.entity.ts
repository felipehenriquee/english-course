import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  Unique,
  UpdateDateColumn,
} from 'typeorm'

import { Question } from '@/features/exercises/entities/question.entity'
import { QuestionItem } from '@/features/exercises/entities/question-item.entity'
import { User } from '@/features/users/entities/user.entity'

/**
 * Resposta de UM aluno pra UMA Question — várias pessoas respondem o mesmo
 * exercício, então não cabe um campo único na própria Question. Não estende
 * BaseEntity (name/description não fariam sentido aqui).
 */
@Entity('student_answers')
@Unique(['questionId', 'userId'])
export class StudentAnswer {
  @PrimaryGeneratedColumn('uuid')
  id!: string

  @ManyToOne(() => Question, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'question_id' })
  question!: Question

  @Column({ name: 'question_id', type: 'varchar', length: 36 })
  questionId!: string

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user!: User

  @Column({ name: 'user_id', type: 'varchar', length: 36 })
  userId!: string

  /** Resposta objetiva (aponta pra uma QuestionItem). */
  @ManyToOne(() => QuestionItem, { onDelete: 'SET NULL', nullable: true })
  @JoinColumn({ name: 'selected_item_id' })
  selectedItem?: QuestionItem

  @Column({ name: 'selected_item_id', type: 'varchar', length: 36, nullable: true })
  selectedItemId!: string | null

  /** Resposta dissertativa. */
  @Column({ name: 'answer_text', type: 'text', nullable: true })
  answerText!: string | null

  @Column({ type: 'boolean', default: false })
  answered!: boolean

  @CreateDateColumn({ name: 'created_at' })
  createdAt!: Date

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt!: Date
}
