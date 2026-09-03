import { Injectable, inject, signal } from '@angular/core'
import { firstValueFrom } from 'rxjs'

import type { PaginatedResponse, QueryParams } from '@app/core/models/api.model'
import { CourseService } from '@app/features/courses/services/course.service'
import type {
  Course,
  CreateCoursePayload,
  UpdateCoursePayload,
} from '@app/features/courses/models/course.model'

function isPaginated(res: Course[] | PaginatedResponse<Course>): res is PaginatedResponse<Course> {
  return !Array.isArray(res)
}

/**
 * Store da feature "courses" (Angular Signals). Encapsula loading/error/items
 * em cima do CourseService — mesmo padrão do UsersStore.
 */
@Injectable({ providedIn: 'root' })
export class CoursesStore {
  private readonly courseService = inject(CourseService)

  private readonly _items = signal<Course[]>([])
  private readonly _loading = signal(false)
  private readonly _error = signal<string | null>(null)

  readonly items = this._items.asReadonly()
  readonly loading = this._loading.asReadonly()
  readonly error = this._error.asReadonly()

  /** Lista os cursos; `search` filtra por nome/descrição (via ?search= na API). */
  async fetchAll(search?: string): Promise<void> {
    this._loading.set(true)
    this._error.set(null)
    try {
      const params: QueryParams = {}
      const term = search?.trim()
      if (term) params['search'] = term
      const res = await firstValueFrom(this.courseService.getAll(params))
      this._items.set(isPaginated(res) ? res.data : res)
    } catch (err) {
      this._error.set((err as Error).message)
    } finally {
      this._loading.set(false)
    }
  }

  getById(id: Course['id']): Promise<Course> {
    return firstValueFrom(this.courseService.getById(id))
  }

  async create(payload: CreateCoursePayload): Promise<Course> {
    const created = await firstValueFrom(this.courseService.create(payload))
    this._items.update((items) => [...items, created])
    return created
  }

  async update(id: Course['id'], payload: UpdateCoursePayload): Promise<Course> {
    const updated = await firstValueFrom(this.courseService.update(id, payload))
    this._items.update((items) => items.map((c) => (c.id === id ? updated : c)))
    return updated
  }

  async remove(id: Course['id']): Promise<void> {
    await firstValueFrom(this.courseService.delete(id))
    this._items.update((items) => items.filter((c) => c.id !== id))
  }
}
