import { createPinia } from 'pinia'
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate'

/**
 * Instância única do Pinia com suporte a persistência (localStorage).
 * Cada store ativa a persistência individualmente com:
 *   defineStore('auth', () => {...}, { persist: true })
 */
export const pinia = createPinia()
pinia.use(piniaPluginPersistedstate)
