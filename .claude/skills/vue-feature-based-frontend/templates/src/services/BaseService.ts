import type { AxiosInstance } from 'axios'
import { http } from '@/services/http'
import type { BaseEntity, PaginatedResponse, QueryParams } from '@/types/api'

/**
 * Service global de CRUD.
 *
 * Toda feature que expõe um recurso REST "convencional" (users, products,
 * orders...) deve criar um service que ESTENDE esta classe, passando só o
 * endpoint do recurso. Ex: features/users/services/userService.ts
 *
 *   class UserService extends BaseService<User> {
 *     constructor() { super('/users') }
 *   }
 *
 * Isso dá getAll/getById/create/update/remove prontos, e a feature só
 * precisa adicionar métodos extras que fujam do CRUD padrão (ex: resetPassword).
 */
export class BaseService<T extends BaseEntity, TCreate = Partial<T>, TUpdate = Partial<T>> {
  protected readonly http: AxiosInstance
  protected readonly resource: string

  /** @param resource Caminho do recurso na API, ex: "/users" */
  constructor(resource: string) {
    this.http = http
    this.resource = resource
  }

  /** Lista todos os registros. Aceita filtros/paginação via query params. */
  async getAll(params?: QueryParams): Promise<T[] | PaginatedResponse<T>> {
    const { data } = await this.http.get<T[] | PaginatedResponse<T>>(this.resource, { params })
    return data
  }

  /** Busca um único registro pelo id. */
  async getById(id: T['id']): Promise<T> {
    const { data } = await this.http.get<T>(`${this.resource}/${id}`)
    return data
  }

  /** Cria um novo registro. */
  async create(payload: TCreate): Promise<T> {
    const { data } = await this.http.post<T>(this.resource, payload)
    return data
  }

  /** Atualiza parcialmente um registro existente (PATCH). */
  async update(id: T['id'], payload: TUpdate): Promise<T> {
    const { data } = await this.http.patch<T>(`${this.resource}/${id}`, payload)
    return data
  }

  /** Substitui um registro inteiro (PUT). Use quando a API exigir PUT em vez de PATCH. */
  async replace(id: T['id'], payload: T): Promise<T> {
    const { data } = await this.http.put<T>(`${this.resource}/${id}`, payload)
    return data
  }

  /** Remove um registro pelo id. */
  async delete(id: T['id']): Promise<void> {
    await this.http.delete(`${this.resource}/${id}`)
  }
}
