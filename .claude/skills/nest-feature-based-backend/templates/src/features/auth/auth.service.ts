import { ConflictException, Injectable, UnauthorizedException } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import * as bcrypt from 'bcryptjs'

import { UsersService } from '@/features/users/users.service'
import { User } from '@/features/users/entities/user.entity'
import { LoginDto } from '@/features/auth/dto/login.dto'
import { RegisterDto } from '@/features/auth/dto/register.dto'
import { AuthUserDto, LoginResponseDto } from '@/features/auth/dto/auth-response.dto'
import type { JwtPayload } from '@/features/auth/strategies/jwt.strategy'

/**
 * Service da feature "auth".
 *
 * Login/registro/logout NÃO são operações CRUD de um recurso (não existe
 * "GET /auth/:id"), então este service é escrito à mão em vez de estender
 * o BaseService — mesma regra usada nas skills de frontend
 * (features/auth/services/authService não estende o BaseService de lá).
 *
 * Regra geral da arquitetura:
 *  - Recurso CRUD "convencional" (users, products...) -> extends BaseService
 *  - Fluxo específico (auth, upload, relatórios...) -> service próprio.
 */
@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  async login(dto: LoginDto): Promise<LoginResponseDto> {
    const user = await this.usersService.findByEmail(dto.email)
    if (!user || !(await bcrypt.compare(dto.password, user.password))) {
      throw new UnauthorizedException('E-mail ou senha inválidos')
    }

    return this.buildLoginResponse(user)
  }

  async register(dto: RegisterDto): Promise<LoginResponseDto> {
    const existing = await this.usersService.findByEmail(dto.email)
    if (existing) {
      throw new ConflictException('Já existe uma conta com este e-mail')
    }

    // UsersService.create já faz o hash da senha antes de persistir — não
    // duplicamos essa lógica aqui.
    const user = await this.usersService.create({
      name: dto.name,
      email: dto.email,
      password: dto.password,
      role: 'viewer',
      active: true,
    })

    return this.buildLoginResponse(user)
  }

  /**
   * Logout é um no-op no backend (JWT é stateless — não existe sessão
   * server-side pra invalidar). Se precisar revogar tokens antes da
   * expiração, adicione uma blocklist (Redis, por exemplo) aqui.
   */
  logout(): void {
    // intencionalmente vazio — ver comentário acima
  }

  async me(userId: string): Promise<AuthUserDto> {
    const user = await this.usersService.getById(userId)
    return this.toAuthUser(user)
  }

  private buildLoginResponse(user: User): LoginResponseDto {
    const payload: JwtPayload = { sub: user.id, email: user.email, role: user.role }
    return {
      token: this.jwtService.sign(payload),
      user: this.toAuthUser(user),
    }
  }

  private toAuthUser(user: User): AuthUserDto {
    return { id: user.id, name: user.name, email: user.email, role: user.role }
  }
}
