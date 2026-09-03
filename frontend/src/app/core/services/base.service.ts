import { inject } from '@angular/core'
import { HttpClient, HttpParams } from '@angular/common/http'
import { Observable } from 'rxjs'
import { environment } from '@env/environment'
import type { BaseEntity, PaginatedResponse, QueryParams } from '@app/core/models/api.model'

/**
 * Service global de CRUD.
 *
 * Toda feature que expõe um recurso REST "convencional" (users, products,
 * orders...) deve criar um service que ESTENDE esta classe, passando só o
 * endpoint do recurso. Ex: features/users/services/user.service.ts
 *
 *   @Injectable({ providedIn: 'root' })
 *   export class UserService extends BaseService<User> {
 *     protected override resource = '/users'
 *   }
 *
 * Isso dá getAll/getById/create/update/remove prontos (via HttpClient), e a
 * feature só precisa adicionar métodos extras que fujam do CRUD padrão
 * (ex: resendInvite). Não precisa de @Injectable na classe filha porque ela
 * herda o `providedIn: 'root'` implícito — mas declare mesmo assim por
 * clareza (ver userService de exemplo).
 */
export abstract class BaseService<
  T extends BaseEntity,
  TCreate = Partial<T>,
  TUpdate = Partial<T>,
> {
  protected readonly http = inject(HttpClient)

  /** Caminho do recurso na API, ex: "/users". Definido pela classe filha. */
  protected abstract resource: string

  /** URL completa do recurso. Protegido (não privado) para que a feature
   *  possa montar endpoints extras que fogem do CRUD padrão, ex:
   *  `${this.baseUrl}/${id}/resend-invite`. */
  protected get baseUrl(): string {
    return `${environment.apiBaseUrl}${this.resource}`
  }

  /** Lista todos os registros. Aceita filtros/paginação via query params. */
  getAll(params?: QueryParams): Observable<T[] | PaginatedResponse<T>> {
    let httpParams = new HttpParams()
    for (const [key, value] of Object.entries(params ?? {})) {
      if (value !== undefined) httpParams = httpParams.set(key, String(value))
    }
    return this.http.get<T[] | PaginatedResponse<T>>(this.baseUrl, { params: httpParams })
  }

  /** Busca um único registro pelo id. */
  getById(id: T['id']): Observable<T> {
    return this.http.get<T>(`${this.baseUrl}/${id}`)
  }

  /** Cria um novo registro. */
  create(payload: TCreate): Observable<T> {
    return this.http.post<T>(this.baseUrl, payload)
  }

  /** Atualiza parcialmente um registro existente (PATCH). */
  update(id: T['id'], payload: TUpdate): Observable<T> {
    return this.http.patch<T>(`${this.baseUrl}/${id}`, payload)
  }

  /** Substitui um registro inteiro (PUT). Use quando a API exigir PUT em vez de PATCH. */
  replace(id: T['id'], payload: T): Observable<T> {
    return this.http.put<T>(`${this.baseUrl}/${id}`, payload)
  }

  /** Remove um registro pelo id. */
  delete(id: T['id']): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`)
  }
}
