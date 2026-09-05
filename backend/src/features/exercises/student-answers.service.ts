import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { FindOptionsWhere, Repository } from 'typeorm'

import { PaginatedResponseDto } from '@/common/dto/paginated-response.dto'
import { BaseService } from '@/common/services/base.service'
import { StudentAnswer } from '@/features/exercises/entities/student-answer.entity'
import { StudentAnswerQueryDto } from '@/features/exercises/dto/student-answer-query.dto'

/** Service da feature "student-answers". CRUD padrão + filtro por pergunta/aluno. */
@Injectable()
export class StudentAnswersService extends BaseService<StudentAnswer> {
  constructor(@InjectRepository(StudentAnswer) repository: Repository<StudentAnswer>) {
    super(repository, 'Resposta')
  }

  override async getAll(
    query: Partial<StudentAnswerQueryDto> = {},
  ): Promise<PaginatedResponseDto<StudentAnswer>> {
    const page = query.page ?? 1
    const perPage = query.perPage ?? 20

    const scope: FindOptionsWhere<StudentAnswer> = {}
    if (query.questionId) {
      scope.questionId = query.questionId
    }
    if (query.userId) {
      scope.userId = query.userId
    }

    const [data, total] = await this.repository.findAndCount({
      where: Object.keys(scope).length > 0 ? scope : undefined,
      skip: (page - 1) * perPage,
      take: perPage,
      order: query.sort ? { [query.sort]: query.order ?? 'ASC' } : undefined,
    })

    return new PaginatedResponseDto(data, total, page, perPage)
  }
}
