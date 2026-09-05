import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'

import { Exercise } from '@/features/exercises/entities/exercise.entity'
import { Question } from '@/features/exercises/entities/question.entity'
import { QuestionItem } from '@/features/exercises/entities/question-item.entity'
import { AnswerKey } from '@/features/exercises/entities/answer-key.entity'
import { StudentAnswer } from '@/features/exercises/entities/student-answer.entity'

import { ExercisesController } from '@/features/exercises/exercises.controller'
import { QuestionsController } from '@/features/exercises/questions.controller'
import { QuestionItemsController } from '@/features/exercises/question-items.controller'
import { AnswerKeysController } from '@/features/exercises/answer-keys.controller'
import { StudentAnswersController } from '@/features/exercises/student-answers.controller'

import { ExercisesService } from '@/features/exercises/exercises.service'
import { QuestionsService } from '@/features/exercises/questions.service'
import { QuestionItemsService } from '@/features/exercises/question-items.service'
import { AnswerKeysService } from '@/features/exercises/answer-keys.service'
import { StudentAnswersService } from '@/features/exercises/student-answers.service'

/**
 * Feature "exercises": exercícios de aulas do tipo `exercise`, suas
 * perguntas, alternativas, gabarito (`AnswerKey`, isolado de propósito) e
 * respostas dos alunos (`StudentAnswer`).
 */
@Module({
  imports: [TypeOrmModule.forFeature([Exercise, Question, QuestionItem, AnswerKey, StudentAnswer])],
  controllers: [
    ExercisesController,
    QuestionsController,
    QuestionItemsController,
    AnswerKeysController,
    StudentAnswersController,
  ],
  providers: [
    ExercisesService,
    QuestionsService,
    QuestionItemsService,
    AnswerKeysService,
    StudentAnswersService,
  ],
})
export class ExercisesModule {}
