import { PartialType } from '@nestjs/swagger'

import { CreateUnitDto } from '@/features/units/dto/create-unit.dto'

/** Todos os campos de CreateUnitDto viram opcionais (PATCH parcial). */
export class UpdateUnitDto extends PartialType(CreateUnitDto) {}
