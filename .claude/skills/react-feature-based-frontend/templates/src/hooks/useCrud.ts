import { useCallback, useState } from 'react'
import type { BaseService } from '@/services/BaseService'
import type { BaseEntity, PaginatedResponse, QueryParams } from '@/types/api'

/**
 * Hook opcional para telas simples que só precisam de loading/error/data
 * em cima de um service (global ou de feature), sem precisar criar uma
 * store Zustand dedicada. Equivalente ao composable useCrud da versão Vue.
 *
 * Uso:
 *   const { items, loading, error, fetchAll } = useCrud(userService)
 */
export function useCrud<T extends BaseEntity>(service: BaseService<T>) {
  const [items, setItems] = useState<T[]>([])
  const [current, setCurrent] = useState<T | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function run<R>(fn: () => Promise<R>): Promise<R | undefined> {
    setLoading(true)
    setError(null)
    try {
      return await fn()
    } catch (err) {
      setError((err as Error).message)
      return undefined
    } finally {
      setLoading(false)
    }
  }

  const fetchAll = useCallback(
    async (params?: QueryParams) => {
      const res = await run(() => service.getAll(params))
      if (res) {
        setItems(Array.isArray(res) ? res : (res as PaginatedResponse<T>).data)
      }
    },
    [service],
  )

  const fetchById = useCallback(
    async (id: T['id']) => {
      setCurrent((await run(() => service.getById(id))) ?? null)
    },
    [service],
  )

  return { items, current, loading, error, fetchAll, fetchById }
}
