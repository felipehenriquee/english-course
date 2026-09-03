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
import { Unit } from '@/features/units/entities/unit.entity'
import { UnitsService } from '@/features/units/units.service'
import { CreateUnitDto } from '@/features/units/dto/create-unit.dto'
import { UpdateUnitDto } from '@/features/units/dto/update-unit.dto'
import { UnitQueryDto } from '@/features/units/dto/unit-query.dto'

/**
 * Endpoints REST em /units — mesmo contrato do BaseService do frontend.
 * `GET /units?courseId=<uuid>` lista as unidades de um curso.
 */
@ApiTags('units')
@ApiBearerAuth()
@Controller('units')
export class UnitsController {
  constructor(private readonly unitsService: UnitsService) {}

  @Get()
  @ApiOkResponse({ type: PaginatedResponseDto })
  getAll(@Query() query: UnitQueryDto): Promise<PaginatedResponseDto<Unit>> {
    return this.unitsService.getAll(query)
  }

  @Get(':id')
  @ApiOkResponse({ type: Unit })
  getById(@Param('id') id: string): Promise<Unit> {
    return this.unitsService.getById(id)
  }

  @Post()
  @ApiOkResponse({ type: Unit })
  create(@Body() dto: CreateUnitDto): Promise<Unit> {
    return this.unitsService.create(dto)
  }

  @Patch(':id')
  @ApiOkResponse({ type: Unit })
  update(@Param('id') id: string, @Body() dto: UpdateUnitDto): Promise<Unit> {
    return this.unitsService.update(id, dto)
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  delete(@Param('id') id: string): Promise<void> {
    return this.unitsService.delete(id)
  }
}
