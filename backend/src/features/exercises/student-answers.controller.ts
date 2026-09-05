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
import { StudentAnswer } from '@/features/exercises/entities/student-answer.entity'
import { StudentAnswersService } from '@/features/exercises/student-answers.service'
import { CreateStudentAnswerDto } from '@/features/exercises/dto/create-student-answer.dto'
import { UpdateStudentAnswerDto } from '@/features/exercises/dto/update-student-answer.dto'
import { StudentAnswerQueryDto } from '@/features/exercises/dto/student-answer-query.dto'

/**
 * Endpoints REST em /student-answers. `GET /student-answers?questionId=&
 * userId=` filtra a resposta de um aluno numa pergunta.
 */
@ApiTags('student-answers')
@ApiBearerAuth()
@Controller('student-answers')
export class StudentAnswersController {
  constructor(private readonly studentAnswersService: StudentAnswersService) {}

  @Get()
  @ApiOkResponse({ type: PaginatedResponseDto })
  getAll(@Query() query: StudentAnswerQueryDto): Promise<PaginatedResponseDto<StudentAnswer>> {
    return this.studentAnswersService.getAll(query)
  }

  @Get(':id')
  @ApiOkResponse({ type: StudentAnswer })
  getById(@Param('id') id: string): Promise<StudentAnswer> {
    return this.studentAnswersService.getById(id)
  }

  @Post()
  @ApiOkResponse({ type: StudentAnswer })
  create(@Body() dto: CreateStudentAnswerDto): Promise<StudentAnswer> {
    return this.studentAnswersService.create(dto)
  }

  @Patch(':id')
  @ApiOkResponse({ type: StudentAnswer })
  update(@Param('id') id: string, @Body() dto: UpdateStudentAnswerDto): Promise<StudentAnswer> {
    return this.studentAnswersService.update(id, dto)
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  delete(@Param('id') id: string): Promise<void> {
    return this.studentAnswersService.delete(id)
  }
}
