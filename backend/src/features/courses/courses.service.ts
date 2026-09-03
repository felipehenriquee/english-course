import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Like, Repository } from 'typeorm'

import { PaginatedResponseDto } from '@/common/dto/paginated-response.dto'
import { PaginationQueryDto } from '@/common/dto/pagination-query.dto'
import { BaseService } from '@/common/services/base.service'
import { Course } from '@/features/courses/entities/course.entity'

/**
 * Service da feature "courses".
 *
 * CRUD padrão (getById/create/update/delete/paginação) vem do BaseService.
 * Aqui só sobrescrevemos `getAll` para aplicar a busca livre (`?search=`)
 * por nome/descrição — usada pela barra de pesquisa da tela de cursos no
 * frontend.
 */
@Injectable()
export class CoursesService extends BaseService<Course> {
  constructor(@InjectRepository(Course) repository: Repository<Course>) {
    super(repository, 'Curso')
  }

  override async getAll(
    query: Partial<PaginationQueryDto> = {},
  ): Promise<PaginatedResponseDto<Course>> {
    const search = query.search?.trim()
    if (!search) {
      return super.getAll(query)
    }

    const page = query.page ?? 1
    const perPage = query.perPage ?? 20

    const [data, total] = await this.repository.findAndCount({
      where: [{ name: Like(`%${search}%`) }, { description: Like(`%${search}%`) }],
      skip: (page - 1) * perPage,
      take: perPage,
      order: query.sort ? { [query.sort]: query.order ?? 'ASC' } : undefined,
    })

    return new PaginatedResponseDto(data, total, page, perPage)
  }
}
