import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { FindOptionsWhere, Like, Repository } from 'typeorm'

import { PaginatedResponseDto } from '@/common/dto/paginated-response.dto'
import { NotFoundError } from '@/common/errors'
import { BaseService } from '@/common/services/base.service'
import { Unit } from '@/features/units/entities/unit.entity'
import { UnitQueryDto } from '@/features/units/dto/unit-query.dto'

/**
 * Service da feature "units". CRUD padrão vem do BaseService; `getAll`
 * ganha o filtro por `?courseId=` e a busca livre `?search=`.
 */
@Injectable()
export class UnitsService extends BaseService<Unit> {
  constructor(@InjectRepository(Unit) repository: Repository<Unit>) {
    super(repository, 'Unidade')
  }

  override async getAll(query: Partial<UnitQueryDto> = {}): Promise<PaginatedResponseDto<Unit>> {
    const page = query.page ?? 1
    const perPage = query.perPage ?? 20
    const search = query.search?.trim()

    const scope: FindOptionsWhere<Unit> = {}
    if (query.courseId) {
      scope.courseId = query.courseId
    }

    let where: FindOptionsWhere<Unit> | FindOptionsWhere<Unit>[] | undefined
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

  override async getById(id: string): Promise<Unit> {
    // Traz também a lista de aulas (só id + nome, ordenadas por nome) — o
    // frontend chama este endpoint ao abrir o accordion da unidade.
    const unit = await this.repository
      .createQueryBuilder('unit')
      .leftJoin('unit.lessons', 'lesson')
      .addSelect(['lesson.id', 'lesson.name'])
      .where('unit.id = :id', { id })
      .orderBy('lesson.name', 'ASC')
      .getOne()

    if (!unit) {
      throw new NotFoundError('Unidade', { id })
    }

    unit.lessonsCount = unit.lessons.length
    return unit
  }
}
