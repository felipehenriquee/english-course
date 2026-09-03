import { http } from '@/services/http'
import type { AuthUser, LoginPayload, LoginResponse } from '@/features/auth/types/auth'

/**
 * Service da feature "auth".
 *
 * Login/logout NÃO são operações CRUD de um recurso (não existe
 * "GET /auth/:id" nem "DELETE /auth/:id"), então este service é escrito
 * à mão em vez de estender o BaseService. Ele reaproveita a mesma
 * instância `http` (com os mesmos interceptors de token/erro).
 *
 * Regra geral da arquitetura:
 *  - Recurso CRUD "convencional" (users, products...) -> extends BaseService
 *  - Fluxo específico (auth, upload, relatórios...) -> service próprio,
 *    usando `http` diretamente, como abaixo.
 */
class AuthService {
  async login(payload: LoginPayload): Promise<LoginResponse> {
    const { data } = await http.post<LoginResponse>('/auth/login', payload)
    return data
  }

  async logout(): Promise<void> {
    await http.post('/auth/logout')
  }

  async me(): Promise<AuthUser> {
    const { data } = await http.get<AuthUser>('/auth/me')
    return data
  }
}

export const authService = new AuthService()
