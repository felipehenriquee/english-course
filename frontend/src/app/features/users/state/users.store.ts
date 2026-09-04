import { Injectable, inject, signal } from '@angular/core'
import { firstValueFrom } from 'rxjs'
import { UserService } from '@app/features/users/services/user.service'
import type {
  CreateUserPayload,
  UpdateUserPayload,
  User,
} from '@app/features/users/models/user.model'
import type { PaginatedResponse, QueryParams } from '@app/core/models/api.model'

function isPaginated(res: User[] | PaginatedResponse<User>): res is PaginatedResponse<User> {
  return !Array.isArray(res)
}

/**
 * Store da feature "users" baseada em Angular Signals (equivalente à
 * userStore do Pinia na versão Vue). Encapsula loading/error/items em cima
 * do UserService, para os componentes não chamarem o service diretamente.
 */
@Injectable({ providedIn: 'root' })
export class UsersStore {
  private readonly userService = inject(UserService)

  private readonly _items = signal<User[]>([])
  private readonly _loading = signal(false)
  private readonly _error = signal<string | null>(null)

  readonly items = this._items.asReadonly()
  readonly loading = this._loading.asReadonly()
  readonly error = this._error.asReadonly()

  /** Lista os usuários; `search` filtra por nome/e-mail (via ?search= na API). */
  async fetchAll(search?: string): Promise<void> {
    this._loading.set(true)
    this._error.set(null)
    try {
      const params: QueryParams = {}
      const term = search?.trim()
      if (term) params['search'] = term
      const res = await firstValueFrom(this.userService.getAll(params))
      this._items.set(isPaginated(res) ? res.data : res)
    } catch (err) {
      this._error.set((err as Error).message)
    } finally {
      this._loading.set(false)
    }
  }

  async create(payload: CreateUserPayload): Promise<User> {
    const created = await firstValueFrom(this.userService.create(payload))
    this._items.update((items) => [...items, created])
    return created
  }

  async update(id: User['id'], payload: UpdateUserPayload): Promise<User> {
    const updated = await firstValueFrom(this.userService.update(id, payload))
    this._items.update((items) => items.map((u) => (u.id === id ? updated : u)))
    return updated
  }

  async remove(id: User['id']): Promise<void> {
    await firstValueFrom(this.userService.delete(id))
    this._items.update((items) => items.filter((u) => u.id !== id))
  }
}
