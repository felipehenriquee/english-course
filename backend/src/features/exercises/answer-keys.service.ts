import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { FindOptionsWhere, Repository } from 'typeorm'

import { PaginatedResponseDto } from '@/common/dto/paginated-response.dto'
import { BaseService } from '@/common/services/base.service'
import { AnswerKey } from '@/features/exercises/entities/answer-key.entity'
import { AnswerKeyQueryDto } from '@/features/exercises/dto/answer-key-query.dto'

/**
 * Service da feature "answer-keys". Recurso isolado de propósito: nenhum
 * outro service (Question/Exercise) importa ou joina este repository — só
 * assim a resposta certa nunca vaza junto com a pergunta.
 */
@Injectable()
export class AnswerKeysService extends BaseService<AnswerKey> {
  constructor(@InjectRepository(AnswerKey) repository: Repository<AnswerKey>) {
    super(repository, 'Gabarito')
  }

  override async getAll(
    query: Partial<AnswerKeyQueryDto> = {},
  ): Promise<PaginatedResponseDto<AnswerKey>> {
    const page = query.page ?? 1
    const perPage = query.perPage ?? 20

    const where: FindOptionsWhere<AnswerKey> | undefined = query.questionId
      ? { questionId: query.questionId }
      : undefined

    const [data, total] = await this.repository.findAndCount({
      where,
      skip: (page - 1) * perPage,
      take: perPage,
      order: query.sort ? { [query.sort]: query.order ?? 'ASC' } : undefined,
    })

    return new PaginatedResponseDto(data, total, page, perPage)
  }
}
