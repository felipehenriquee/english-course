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
import { Exercise } from '@/features/exercises/entities/exercise.entity'
import { ExercisesService } from '@/features/exercises/exercises.service'
import { CreateExerciseDto } from '@/features/exercises/dto/create-exercise.dto'
import { UpdateExerciseDto } from '@/features/exercises/dto/update-exercise.dto'
import { ExerciseQueryDto } from '@/features/exercises/dto/exercise-query.dto'

/**
 * Endpoints REST em /exercises. `GET /exercises?lessonId=<uuid>` filtra por
 * aula (cada aula do tipo "exercise" tem no máximo um exercício).
 */
@ApiTags('exercises')
@ApiBearerAuth()
@Controller('exercises')
export class ExercisesController {
  constructor(private readonly exercisesService: ExercisesService) {}

  @Get()
  @ApiOkResponse({ type: PaginatedResponseDto })
  getAll(@Query() query: ExerciseQueryDto): Promise<PaginatedResponseDto<Exercise>> {
    return this.exercisesService.getAll(query)
  }

  @Get(':id')
  @ApiOkResponse({ type: Exercise })
  getById(@Param('id') id: string): Promise<Exercise> {
    return this.exercisesService.getById(id)
  }

  @Post()
  @ApiOkResponse({ type: Exercise })
  create(@Body() dto: CreateExerciseDto): Promise<Exercise> {
    return this.exercisesService.create(dto)
  }

  @Patch(':id')
  @ApiOkResponse({ type: Exercise })
  update(@Param('id') id: string, @Body() dto: UpdateExerciseDto): Promise<Exercise> {
    return this.exercisesService.update(id, dto)
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  delete(@Param('id') id: string): Promise<void> {
    return this.exercisesService.delete(id)
  }
}
