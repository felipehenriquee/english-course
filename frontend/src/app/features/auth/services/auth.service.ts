import { Injectable, inject } from '@angular/core'
import { HttpClient } from '@angular/common/http'
import { Observable } from 'rxjs'
import { environment } from '@env/environment'
import type { AuthUser, LoginPayload, LoginResponse } from '@app/features/auth/models/auth.model'

/**
 * Service da feature "auth".
 *
 * Login/logout NÃO são operações CRUD de um recurso (não existe
 * "GET /auth/:id" nem "DELETE /auth/:id"), então este service é escrito
 * à mão em vez de estender o BaseService. Ele usa o mesmo HttpClient
 * global (com os mesmos interceptors de token/erro).
 *
 * Regra geral da arquitetura:
 *  - Recurso CRUD "convencional" (users, products...) -> extends BaseService
 *  - Fluxo específico (auth, upload, relatórios...) -> service próprio,
 *    injetando HttpClient diretamente, como abaixo.
 */
@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly http = inject(HttpClient)
  private readonly baseUrl = `${environment.apiBaseUrl}/auth`

  login(payload: LoginPayload): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(`${this.baseUrl}/login`, payload)
  }

  logout(): Observable<void> {
    return this.http.post<void>(`${this.baseUrl}/logout`, {})
  }

  me(): Observable<AuthUser> {
    return this.http.get<AuthUser>(`${this.baseUrl}/me`)
  }
}
