import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common'
import { ApiBearerAuth, ApiOkResponse, ApiTags } from '@nestjs/swagger'

import { PaginationQueryDto } from '@/common/dto/pagination-query.dto'
import { PaginatedResponseDto } from '@/common/dto/paginated-response.dto'
import { Course } from '@/features/courses/entities/course.entity'
import { CoursesService } from '@/features/courses/courses.service'
import { CreateCourseDto } from '@/features/courses/dto/create-course.dto'
import { UpdateCourseDto } from '@/features/courses/dto/update-course.dto'

/**
 * Endpoints REST "convencionais" em /courses — mesmo contrato que o
 * courseService (BaseService) do frontend chama: getAll -> GET /courses,
 * getById -> GET /courses/:id, create -> POST /courses,
 * update -> PATCH /courses/:id, delete -> DELETE /courses/:id.
 */
@ApiTags('courses')
@ApiBearerAuth()
@Controller('courses')
export class CoursesController {
  constructor(private readonly coursesService: CoursesService) {}

  @Get()
  @ApiOkResponse({ type: PaginatedResponseDto })
  getAll(@Query() query: PaginationQueryDto): Promise<PaginatedResponseDto<Course>> {
    return this.coursesService.getAll(query)
  }

  @Get(':id')
  @ApiOkResponse({ type: Course })
  getById(@Param('id') id: string): Promise<Course> {
    return this.coursesService.getById(id)
  }

  @Post()
  @ApiOkResponse({ type: Course })
  create(@Body() dto: CreateCourseDto): Promise<Course> {
    return this.coursesService.create(dto)
  }

  @Patch(':id')
  @ApiOkResponse({ type: Course })
  update(@Param('id') id: string, @Body() dto: UpdateCourseDto): Promise<Course> {
    return this.coursesService.update(id, dto)
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  delete(@Param('id') id: string): Promise<void> {
    return this.coursesService.delete(id)
  }
}
