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
import { Question } from '@/features/exercises/entities/question.entity'
import { QuestionsService } from '@/features/exercises/questions.service'
import { CreateQuestionDto } from '@/features/exercises/dto/create-question.dto'
import { UpdateQuestionDto } from '@/features/exercises/dto/update-question.dto'
import { QuestionQueryDto } from '@/features/exercises/dto/question-query.dto'

/**
 * Endpoints REST em /questions. `GET /questions?exerciseId=<uuid>` lista as
 * perguntas de um exercício. Nunca devolve a resposta certa — ver
 * /answer-keys, endpoint isolado de propósito.
 */
@ApiTags('questions')
@ApiBearerAuth()
@Controller('questions')
export class QuestionsController {
  constructor(private readonly questionsService: QuestionsService) {}

  @Get()
  @ApiOkResponse({ type: PaginatedResponseDto })
  getAll(@Query() query: QuestionQueryDto): Promise<PaginatedResponseDto<Question>> {
    return this.questionsService.getAll(query)
  }

  @Get(':id')
  @ApiOkResponse({ type: Question })
  getById(@Param('id') id: string): Promise<Question> {
    return this.questionsService.getById(id)
  }

  @Post()
  @ApiOkResponse({ type: Question })
  create(@Body() dto: CreateQuestionDto): Promise<Question> {
    return this.questionsService.createQuestion(dto)
  }

  @Patch(':id')
  @ApiOkResponse({ type: Question })
  update(@Param('id') id: string, @Body() dto: UpdateQuestionDto): Promise<Question> {
    return this.questionsService.updateQuestion(id, dto)
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  delete(@Param('id') id: string): Promise<void> {
    return this.questionsService.delete(id)
  }
}
