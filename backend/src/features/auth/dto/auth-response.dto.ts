import { ApiProperty } from '@nestjs/swagger'

/**
 * Formato do usuário autenticado devolvido por login/register/me.
 * Mesmo shape do `AuthUser` esperado pelas 3 skills de frontend
 * (features/auth/types/auth.ts) — sem o hash da senha.
 */
export class AuthUserDto {
  @ApiProperty()
  id!: string

  @ApiProperty()
  name!: string

  @ApiProperty()
  email!: string

  @ApiProperty()
  role!: string
}

/**
 * Resposta de POST /auth/login e /auth/register.
 * Mesmo shape do `LoginResponse` esperado pelas 3 skills de frontend.
 */
export class LoginResponseDto {
  @ApiProperty()
  token!: string

  @ApiProperty({ type: AuthUserDto })
  user!: AuthUserDto
}
