import { create } from 'zustand'

import { userService } from '@/features/users/services/userService'
import type { CreateUserPayload, UpdateUserPayload, User } from '@/features/users/types/user'
import type { PaginatedResponse } from '@/types/api'

function isPaginated(res: User[] | PaginatedResponse<User>): res is PaginatedResponse<User> {
  return !Array.isArray(res)
}

interface UsersState {
  items: User[]
  loading: boolean
  error: string | null
  fetchAll: () => Promise<void>
  create: (payload: CreateUserPayload) => Promise<User>
  update: (id: User['id'], payload: UpdateUserPayload) => Promise<User>
  remove: (id: User['id']) => Promise<void>
}

export const useUserStore = create<UsersState>()((set, get) => ({
  items: [],
  loading: false,
  error: null,

  async fetchAll() {
    set({ loading: true, error: null })
    try {
      const res = await userService.getAll()
      set({ items: isPaginated(res) ? res.data : res })
    } catch (err) {
      set({ error: (err as Error).message })
    } finally {
      set({ loading: false })
    }
  },

  async create(payload) {
    const created = await userService.create(payload)
    set({ items: [...get().items, created] })
    return created
  },

  async update(id, payload) {
    const updated = await userService.update(id, payload)
    set({ items: get().items.map((u) => (u.id === id ? updated : u)) })
    return updated
  },

  async remove(id) {
    await userService.delete(id)
    set({ items: get().items.filter((u) => u.id !== id) })
  },
}))
