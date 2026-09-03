import { Navigate, Outlet } from 'react-router-dom'
import { useAuthStore } from '@/features/auth/store/authStore'

/**
 * Guarda inversa: usada na rota de /login para impedir que um usuário já
 * autenticado volte pra tela de login. Equivalente ao guestGuard da versão
 * Angular.
 */
export function GuestRoute() {
  const isAuthenticated = useAuthStore((state) => !!state.token)

  if (isAuthenticated) {
    return <Navigate to="/" replace />
  }

  return <Outlet />
}
