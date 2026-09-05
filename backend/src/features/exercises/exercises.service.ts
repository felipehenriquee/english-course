import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { FindOptionsWhere, Like, Repository } from 'typeorm'

import { PaginatedResponseDto } from '@/common/dto/paginated-response.dto'
import { NotFoundError } from '@/common/errors'
import { BaseService } from '@/common/services/base.service'
import { Exercise } from '@/features/exercises/entities/exercise.entity'
import { ExerciseQueryDto } from '@/features/exercises/dto/exercise-query.dto'

/**
 * Service da feature "exercises". CRUD padrão vem do BaseService; `getAll`
 * ganha o filtro por `?lessonId=` e a busca livre `?search=`; `getById`
 * embute refs leves das questions — SEM tocar em AnswerKey (ver
 * QuestionsService/AnswerKeysService — isolamento é de propósito).
 */
@Injectable()
export class ExercisesService extends BaseService<Exercise> {
  constructor(@InjectRepository(Exercise) repository: Repository<Exercise>) {
    super(repository, 'Exercício')
  }

  override async getAll(
    query: Partial<ExerciseQueryDto> = {},
  ): Promise<PaginatedResponseDto<Exercise>> {
    const page = query.page ?? 1
    const perPage = query.perPage ?? 20
    const search = query.search?.trim()

    const scope: FindOptionsWhere<Exercise> = {}
    if (query.lessonId) {
      scope.lessonId = query.lessonId
    }

    let where: FindOptionsWhere<Exercise> | FindOptionsWhere<Exercise>[] | undefined
    if (search) {
      where = [
        { ...scope, name: Like(`%${search}%`) },
        { ...scope, description: Like(`%${search}%`) },
      ]
    } else if (Object.keys(scope).length > 0) {
      where = scope
    }

    const [data, total] = await this.repository.findAndCount({
      where,
      skip: (page - 1) * perPage,
      take: perPage,
      order: query.sort ? { [query.sort]: query.order ?? 'ASC' } : undefined,
    })

    return new PaginatedResponseDto(data, total, page, perPage)
  }

  override async getById(id: string): Promise<Exercise> {
    const exercise = await this.repository
      .createQueryBuilder('exercise')
      .leftJoin('exercise.questions', 'question')
      .addSelect(['question.id', 'question.content', 'question.type'])
      .leftJoin('exercise.referenceLesson', 'referenceLesson')
      .addSelect(['referenceLesson.id', 'referenceLesson.name'])
      .where('exercise.id = :id', { id })
      .getOne()

    if (!exercise) {
      throw new NotFoundError('Exercício', { id })
    }

    return exercise
  }
}
