import { BaseService } from '@/services/BaseService'
import type { CreateUserPayload, UpdateUserPayload, User } from '@/features/users/types/user'

/**
 * Service da feature "users".
 *
 * Exemplo de feature CRUD "convencional": basta estender o BaseService
 * apontando para o endpoint do recurso. getAll/getById/create/update/delete
 * já vêm prontos e tipados como User.
 *
 * Métodos que fogem do CRUD padrão (ex: reenviar convite, resetar senha)
 * entram aqui como métodos extras, reaproveitando `this.http`.
 */
class UserService extends BaseService<User, CreateUserPayload, UpdateUserPayload> {
  constructor() {
    super('/users')
  }

  /** Exemplo de método específico da feature, além do CRUD herdado. */
  async resendInvite(id: User['id']): Promise<void> {
    await this.http.post(`${this.resource}/${id}/resend-invite`)
  }
}

export const userService = new UserService()
