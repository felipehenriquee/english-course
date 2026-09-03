import { ref } from 'vue'
import type { BaseService } from '@/services/BaseService'
import type { BaseEntity, PaginatedResponse, QueryParams } from '@/types/api'

/**
 * Composable opcional para telas simples que só precisam de
 * loading/error/data em cima de um service (global ou de feature),
 * sem precisar criar uma store Pinia dedicada.
 *
 * Uso:
 *   const { items, loading, error, fetchAll } = useCrud(userService)
 */
export function useCrud<T extends BaseEntity>(service: BaseService<T>) {
  const items = ref<T[]>([]) as { value: T[] }
  const current = ref<T | null>(null) as { value: T | null }
  const loading = ref(false)
  const error = ref<string | null>(null)

  async function run<R>(fn: () => Promise<R>): Promise<R | undefined> {
    loading.value = true
    error.value = null
    try {
      return await fn()
    } catch (err) {
      error.value = (err as Error).message
      return undefined
    } finally {
      loading.value = false
    }
  }

  async function fetchAll(params?: QueryParams) {
    const res = await run(() => service.getAll(params))
    if (res) {
      items.value = Array.isArray(res) ? res : (res as PaginatedResponse<T>).data
    }
  }

  async function fetchById(id: T['id']) {
    current.value = (await run(() => service.getById(id))) ?? null
  }

  return { items, current, loading, error, fetchAll, fetchById }
}
