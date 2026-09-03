import { ApiPropertyOptional, PartialType } from '@nestjs/swagger'
import { IsOptional, IsString, MinLength } from 'class-validator'

import { CreateUserDto } from '@/features/users/dto/create-user.dto'

/**
 * Todos os campos de CreateUserDto viram opcionais (PATCH parcial).
 * `password` ganha uma validação própria pra não exigir MinLength(6) do
 * pai quando o campo simplesmente não for enviado.
 */
export class UpdateUserDto extends PartialType(CreateUserDto) {
  @ApiPropertyOptional({ minLength: 6 })
  @IsOptional()
  @IsString()
  @MinLength(6)
  declare password?: string
}
