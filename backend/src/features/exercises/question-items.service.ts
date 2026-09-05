import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { FindOptionsWhere, Repository } from 'typeorm'

import { PaginatedResponseDto } from '@/common/dto/paginated-response.dto'
import { BaseService } from '@/common/services/base.service'
import { QuestionItem } from '@/features/exercises/entities/question-item.entity'
import { QuestionItemQueryDto } from '@/features/exercises/dto/question-item-query.dto'

/** Service da feature "question-items". CRUD padrão + filtro por `?questionId=`. */
@Injectable()
export class QuestionItemsService extends BaseService<QuestionItem> {
  constructor(@InjectRepository(QuestionItem) repository: Repository<QuestionItem>) {
    super(repository, 'Alternativa')
  }

  override async getAll(
    query: Partial<QuestionItemQueryDto> = {},
  ): Promise<PaginatedResponseDto<QuestionItem>> {
    const page = query.page ?? 1
    const perPage = query.perPage ?? 20

    const where: FindOptionsWhere<QuestionItem> | undefined = query.questionId
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
