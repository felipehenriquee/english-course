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
import { AnswerKey } from '@/features/exercises/entities/answer-key.entity'
import { AnswerKeysService } from '@/features/exercises/answer-keys.service'
import { CreateAnswerKeyDto } from '@/features/exercises/dto/create-answer-key.dto'
import { UpdateAnswerKeyDto } from '@/features/exercises/dto/update-answer-key.dto'
import { AnswerKeyQueryDto } from '@/features/exercises/dto/answer-key-query.dto'

/**
 * Endpoints REST em /answer-keys — recurso ISOLADO de propósito: nenhum
 * endpoint de /questions embute ou referencia estes dados, pra um aluno não
 * conseguir a resposta certa antes da hora inspecionando a API.
 */
@ApiTags('answer-keys')
@ApiBearerAuth()
@Controller('answer-keys')
export class AnswerKeysController {
  constructor(private readonly answerKeysService: AnswerKeysService) {}

  @Get()
  @ApiOkResponse({ type: PaginatedResponseDto })
  getAll(@Query() query: AnswerKeyQueryDto): Promise<PaginatedResponseDto<AnswerKey>> {
    return this.answerKeysService.getAll(query)
  }

  @Get(':id')
  @ApiOkResponse({ type: AnswerKey })
  getById(@Param('id') id: string): Promise<AnswerKey> {
    return this.answerKeysService.getById(id)
  }

  @Post()
  @ApiOkResponse({ type: AnswerKey })
  create(@Body() dto: CreateAnswerKeyDto): Promise<AnswerKey> {
    return this.answerKeysService.create(dto)
  }

  @Patch(':id')
  @ApiOkResponse({ type: AnswerKey })
  update(@Param('id') id: string, @Body() dto: UpdateAnswerKeyDto): Promise<AnswerKey> {
    return this.answerKeysService.update(id, dto)
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  delete(@Param('id') id: string): Promise<void> {
    return this.answerKeysService.delete(id)
  }
}
