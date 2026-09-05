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
import { QuestionItem } from '@/features/exercises/entities/question-item.entity'
import { QuestionItemsService } from '@/features/exercises/question-items.service'
import { CreateQuestionItemDto } from '@/features/exercises/dto/create-question-item.dto'
import { UpdateQuestionItemDto } from '@/features/exercises/dto/update-question-item.dto'
import { QuestionItemQueryDto } from '@/features/exercises/dto/question-item-query.dto'

/**
 * Endpoints REST em /question-items. Normalmente as alternativas são
 * criadas em lote via `POST/PATCH /questions` (campo `items`); estes
 * endpoints cobrem edição/remoção pontual de uma alternativa.
 */
@ApiTags('question-items')
@ApiBearerAuth()
@Controller('question-items')
export class QuestionItemsController {
  constructor(private readonly questionItemsService: QuestionItemsService) {}

  @Get()
  @ApiOkResponse({ type: PaginatedResponseDto })
  getAll(@Query() query: QuestionItemQueryDto): Promise<PaginatedResponseDto<QuestionItem>> {
    return this.questionItemsService.getAll(query)
  }

  @Get(':id')
  @ApiOkResponse({ type: QuestionItem })
  getById(@Param('id') id: string): Promise<QuestionItem> {
    return this.questionItemsService.getById(id)
  }

  @Post()
  @ApiOkResponse({ type: QuestionItem })
  create(@Body() dto: CreateQuestionItemDto): Promise<QuestionItem> {
    return this.questionItemsService.create(dto)
  }

  @Patch(':id')
  @ApiOkResponse({ type: QuestionItem })
  update(@Param('id') id: string, @Body() dto: UpdateQuestionItemDto): Promise<QuestionItem> {
    return this.questionItemsService.update(id, dto)
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  delete(@Param('id') id: string): Promise<void> {
    return this.questionItemsService.delete(id)
  }
}
