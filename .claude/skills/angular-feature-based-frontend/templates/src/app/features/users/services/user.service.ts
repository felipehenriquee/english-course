import { Injectable } from '@angular/core'
import { Observable } from 'rxjs'
import { BaseService } from '@app/core/services/base.service'
import type {
  CreateUserPayload,
  UpdateUserPayload,
  User,
} from '@app/features/users/models/user.model'

/**
 * Service da feature "users".
 *
 * Exemplo de feature CRUD "convencional": basta estender o BaseService
 * apontando para o endpoint do recurso. getAll/getById/create/update/delete
 * já vêm prontos e tipados como User (via HttpClient/RxJS).
 *
 * Métodos que fogem do CRUD padrão (ex: reenviar convite, resetar senha)
 * entram aqui como métodos extras, reaproveitando `this.http` e `this.baseUrl`.
 */
@Injectable({ providedIn: 'root' })
export class UserService extends BaseService<User, CreateUserPayload, UpdateUserPayload> {
  protected override resource = '/users'

  /** Exemplo de método específico da feature, além do CRUD herdado. */
  resendInvite(id: User['id']): Observable<void> {
    return this.http.post<void>(`${this.baseUrl}/${id}/resend-invite`, {})
  }
}
