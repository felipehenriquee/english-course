import { Injectable, computed, inject, signal } from '@angular/core'
import { firstValueFrom } from 'rxjs'
import { AuthService } from '@app/features/auth/services/auth.service'
import type { AuthUser, LoginPayload } from '@app/features/auth/models/auth.model'

/**
 * Store de autenticação baseada em Angular Signals (equivalente ao
 * useAuthStore do Pinia na versão Vue). É um service injetável comum,
 * só que o estado interno é feito com `signal()` em vez de `ref()`.
 *
 * O token é persistido em localStorage manualmente (mesma abordagem da
 * versão Vue) para sobreviver a refresh de página.
 */
@Injectable({ providedIn: 'root' })
export class AuthStore {
  private readonly authService = inject(AuthService)

  private readonly _token = signal<string | null>(localStorage.getItem('auth_token'))
  private readonly _user = signal<AuthUser | null>(null)
  private readonly _loading = signal(false)
  private readonly _error = signal<string | null>(null)

  readonly token = this._token.asReadonly()
  readonly user = this._user.asReadonly()
  readonly loading = this._loading.asReadonly()
  readonly error = this._error.asReadonly()
  readonly isAuthenticated = computed(() => !!this._token())

  async login(payload: LoginPayload): Promise<void> {
    this._loading.set(true)
    this._error.set(null)
    try {
      const response = await firstValueFrom(this.authService.login(payload))
      this._token.set(response.token)
      this._user.set(response.user)
      localStorage.setItem('auth_token', response.token)
    } catch (err) {
      this._error.set((err as Error).message)
      throw err
    } finally {
      this._loading.set(false)
    }
  }

  async logout(): Promise<void> {
    try {
      await firstValueFrom(this.authService.logout())
    } finally {
      this._token.set(null)
      this._user.set(null)
      localStorage.removeItem('auth_token')
    }
  }

  /** Recarrega o usuário logado a partir do token salvo (ex: no refresh da página). */
  async fetchCurrentUser(): Promise<void> {
    if (!this._token()) return
    this._user.set(await firstValueFrom(this.authService.me()))
  }
}
