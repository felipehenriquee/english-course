import { Body, Controller, Get, HttpCode, HttpStatus, Post } from '@nestjs/common'
import { ApiBearerAuth, ApiOkResponse, ApiTags } from '@nestjs/swagger'

import { Public } from '@/common/decorators/public.decorator'
import { CurrentUser } from '@/common/decorators/current-user.decorator'
import type { AuthenticatedUser } from '@/common/types/authenticated-user.type'
import { AuthService } from '@/features/auth/auth.service'
import { LoginDto } from '@/features/auth/dto/login.dto'
import { RegisterDto } from '@/features/auth/dto/register.dto'
import { AuthUserDto, LoginResponseDto } from '@/features/auth/dto/auth-response.dto'

/**
 * Endpoints alinhados de propósito com o que as 3 skills de frontend
 * (vue/angular/react-feature-based-frontend) já esperam no authService:
 * POST /auth/login, POST /auth/logout, GET /auth/me — mesmo shape de
 * resposta ({ token, user }). POST /auth/register é um bônus desta skill
 * (os frontends não têm tela de registro pronta, só login).
 */
@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Public()
  @Post('login')
  @ApiOkResponse({ type: LoginResponseDto })
  login(@Body() dto: LoginDto): Promise<LoginResponseDto> {
    return this.authService.login(dto)
  }

  @Public()
  @Post('register')
  @ApiOkResponse({ type: LoginResponseDto })
  register(@Body() dto: RegisterDto): Promise<LoginResponseDto> {
    return this.authService.register(dto)
  }

  @ApiBearerAuth()
  @Post('logout')
  @HttpCode(HttpStatus.NO_CONTENT)
  logout(): void {
    this.authService.logout()
  }

  @ApiBearerAuth()
  @Get('me')
  @ApiOkResponse({ type: AuthUserDto })
  me(@CurrentUser() user: AuthenticatedUser): Promise<AuthUserDto> {
    return this.authService.me(user.id)
  }
}
