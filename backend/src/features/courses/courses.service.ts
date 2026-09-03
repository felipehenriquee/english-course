import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'

import { PaginatedResponseDto } from '@/common/dto/paginated-response.dto'
import { PaginationQueryDto } from '@/common/dto/pagination-query.dto'
import { NotFoundError } from '@/common/errors'
import { BaseService } from '@/common/services/base.service'
import { Course } from '@/features/courses/entities/course.entity'

/** Campos permitidos em `?sort=` (evita SQL injection no orderBy). */
const SORTABLE = ['name', 'createdAt', 'updatedAt'] as const

/**
 * Service da feature "courses".
 *
 * Sobrescreve `getAll`/`getById` para usar QueryBuilder e mapear
 * `unitsCount` (nº de unidades do curso) via `loadRelationCountAndMap` —
 * esse número é enviado no JSON da API e exibido na tabela de cursos do
 * frontend. `getAll` também aplica a busca livre `?search=`.
 */
@Injectable()
export class CoursesService extends BaseService<Course> {
  constructor(@InjectRepository(Course) repository: Repository<Course>) {
    super(repository, 'Curso')
  }

  override async getAll(
    query: Partial<PaginationQueryDto> = {},
  ): Promise<PaginatedResponseDto<Course>> {
    const page = query.page ?? 1
    const perPage = query.perPage ?? 20
    const search = query.search?.trim()

    const qb = this.repository
      .createQueryBuilder('course')
      .loadRelationCountAndMap('course.unitsCount', 'course.units')
      .skip((page - 1) * perPage)
      .take(perPage)

    if (search) {
      qb.andWhere('(course.name LIKE :search OR course.description LIKE :search)', {
        search: `%${search}%`,
      })
    }

    const sort = (SORTABLE as readonly string[]).includes(query.sort ?? '')
      ? (query.sort as string)
      : 'createdAt'
    qb.orderBy(`course.${sort}`, query.order === 'DESC' ? 'DESC' : 'ASC')

    const [data, total] = await qb.getManyAndCount()
    return new PaginatedResponseDto(data, total, page, perPage)
  }

  override async getById(id: string): Promise<Course> {
    // Além dos campos do curso, traz a lista de unidades (só id + nome,
    // ordenadas por nome) — usada na tela de detalhe do curso no frontend.
    const course = await this.repository
      .createQueryBuilder('course')
      .leftJoin('course.units', 'unit')
      .addSelect(['unit.id', 'unit.name'])
      .loadRelationCountAndMap('unit.lessonsCount', 'unit.lessons')
      .where('course.id = :id', { id })
      .orderBy('unit.name', 'ASC')
      .getOne()

    if (!course) {
      throw new NotFoundError('Curso', { id })
    }

    course.unitsCount = course.units.length
    return course
  }
}
