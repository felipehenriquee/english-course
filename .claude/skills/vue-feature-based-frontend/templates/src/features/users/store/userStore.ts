import { ref } from 'vue'
import { defineStore } from 'pinia'

import { userService } from '@/features/users/services/userService'
import type { CreateUserPayload, UpdateUserPayload, User } from '@/features/users/types/user'
import type { PaginatedResponse } from '@/types/api'

function isPaginated(res: User[] | PaginatedResponse<User>): res is PaginatedResponse<User> {
  return !Array.isArray(res)
}

export const useUserStore = defineStore('users', () => {
  const items = ref<User[]>([])
  const loading = ref(false)
  const error = ref<string | null>(null)

  async function fetchAll() {
    loading.value = true
    error.value = null
    try {
      const res = await userService.getAll()
      items.value = isPaginated(res) ? res.data : res
    } catch (err) {
      error.value = (err as Error).message
    } finally {
      loading.value = false
    }
  }

  async function create(payload: CreateUserPayload) {
    const created = await userService.create(payload)
    items.value.push(created)
    return created
  }

  async function update(id: User['id'], payload: UpdateUserPayload) {
    const updated = await userService.update(id, payload)
    const index = items.value.findIndex((u) => u.id === id)
    if (index !== -1) items.value[index] = updated
    return updated
  }

  async function remove(id: User['id']) {
    await userService.delete(id)
    items.value = items.value.filter((u) => u.id !== id)
  }

  return { items, loading, error, fetchAll, create, update, remove }
})
