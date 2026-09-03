import { computed, ref } from 'vue'
import { defineStore } from 'pinia'

import { authService } from '@/features/auth/services/authService'
import type { AuthUser, LoginPayload } from '@/features/auth/types/auth'

export const useAuthStore = defineStore(
  'auth',
  () => {
    const token = ref<string | null>(localStorage.getItem('auth_token'))
    const user = ref<AuthUser | null>(null)
    const loading = ref(false)
    const error = ref<string | null>(null)

    const isAuthenticated = computed(() => !!token.value)

    async function login(payload: LoginPayload) {
      loading.value = true
      error.value = null
      try {
        const response = await authService.login(payload)
        token.value = response.token
        user.value = response.user
        localStorage.setItem('auth_token', response.token)
        return response
      } catch (err) {
        error.value = (err as Error).message
        throw err
      } finally {
        loading.value = false
      }
    }

    async function logout() {
      try {
        await authService.logout()
      } finally {
        token.value = null
        user.value = null
        localStorage.removeItem('auth_token')
      }
    }

    /** Recarrega o usuário logado a partir do token salvo (ex: no refresh da página). */
    async function fetchCurrentUser() {
      if (!token.value) return
      user.value = await authService.me()
    }

    return { token, user, loading, error, isAuthenticated, login, logout, fetchCurrentUser }
  },
  {
    // Persiste só o essencial no localStorage; o resto é reconstruído em runtime.
    persist: { pick: ['token', 'user'] },
  },
)
