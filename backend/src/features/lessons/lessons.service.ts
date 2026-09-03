import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { FindOptionsWhere, Like, Repository } from 'typeorm'

import { PaginatedResponseDto } from '@/common/dto/paginated-response.dto'
import { BaseService } from '@/common/services/base.service'
import { Lesson } from '@/features/lessons/entities/lesson.entity'
import { LessonQueryDto } from '@/features/lessons/dto/lesson-query.dto'

/**
 * Service da feature "lessons". CRUD padrão vem do BaseService; `getAll`
 * ganha o filtro por `?unitId=` e a busca livre `?search=`.
 */
@Injectable()
export class LessonsService extends BaseService<Lesson> {
  constructor(@InjectRepository(Lesson) repository: Repository<Lesson>) {
    super(repository, 'Aula')
  }

  override async getAll(
    query: Partial<LessonQueryDto> = {},
  ): Promise<PaginatedResponseDto<Lesson>> {
    const page = query.page ?? 1
    const perPage = query.perPage ?? 20
    const search = query.search?.trim()

    const scope: FindOptionsWhere<Lesson> = {}
    if (query.unitId) {
      scope.unitId = query.unitId
    }

    let where: FindOptionsWhere<Lesson> | FindOptionsWhere<Lesson>[] | undefined
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
      // `content` (HTML da aula) pode ser grande — fica de fora da listagem,
      // só é devolvido pelo getById (herdado do BaseService).
      select: ['id', 'name', 'description', 'unitId', 'createdAt', 'updatedAt'],
      skip: (page - 1) * perPage,
      take: perPage,
      order: query.sort ? { [query.sort]: query.order ?? 'ASC' } : undefined,
    })

    return new PaginatedResponseDto(data, total, page, perPage)
  }
}
