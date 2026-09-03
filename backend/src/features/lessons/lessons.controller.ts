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

import { PaginatedResponseDto } from '@/common/dto/paginated-response.dto'
import { Lesson } from '@/features/lessons/entities/lesson.entity'
import { LessonsService } from '@/features/lessons/lessons.service'
import { CreateLessonDto } from '@/features/lessons/dto/create-lesson.dto'
import { UpdateLessonDto } from '@/features/lessons/dto/update-lesson.dto'
import { LessonQueryDto } from '@/features/lessons/dto/lesson-query.dto'

/**
 * Endpoints REST em /lessons. `GET /lessons?unitId=<uuid>` lista as aulas
 * de uma unidade.
 */
@ApiTags('lessons')
@ApiBearerAuth()
@Controller('lessons')
export class LessonsController {
  constructor(private readonly lessonsService: LessonsService) {}

  @Get()
  @ApiOkResponse({ type: PaginatedResponseDto })
  getAll(@Query() query: LessonQueryDto): Promise<PaginatedResponseDto<Lesson>> {
    return this.lessonsService.getAll(query)
  }

  @Get(':id')
  @ApiOkResponse({ type: Lesson })
  getById(@Param('id') id: string): Promise<Lesson> {
    return this.lessonsService.getById(id)
  }

  @Post()
  @ApiOkResponse({ type: Lesson })
  create(@Body() dto: CreateLessonDto): Promise<Lesson> {
    return this.lessonsService.create(dto)
  }

  @Patch(':id')
  @ApiOkResponse({ type: Lesson })
  update(@Param('id') id: string, @Body() dto: UpdateLessonDto): Promise<Lesson> {
    return this.lessonsService.update(id, dto)
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  delete(@Param('id') id: string): Promise<void> {
    return this.lessonsService.delete(id)
  }
}
