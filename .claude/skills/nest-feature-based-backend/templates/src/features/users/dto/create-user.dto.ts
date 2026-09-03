import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'
import { IsBoolean, IsEmail, IsIn, IsOptional, IsString, MinLength } from 'class-validator'
import type { UserRole } from '@/features/users/entities/user.entity'

export class CreateUserDto {
  @ApiProperty({ example: 'Ada Lovelace' })
  @IsString()
  name!: string

  @ApiProperty({ example: 'user@example.com' })
  @IsEmail()
  email!: string

  @ApiProperty({ example: 'senha-forte-123', minLength: 6 })
  @IsString()
  @MinLength(6)
  password!: string

  @ApiPropertyOptional({ enum: ['admin', 'editor', 'viewer'], default: 'viewer' })
  @IsOptional()
  @IsIn(['admin', 'editor', 'viewer'])
  role?: UserRole

  @ApiPropertyOptional({ default: true })
  @IsOptional()
  @IsBoolean()
  active?: boolean
}
