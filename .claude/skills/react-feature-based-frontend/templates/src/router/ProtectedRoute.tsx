import { Navigate, Outlet, useLocation } from 'react-router-dom'
import { useAuthStore } from '@/features/auth/store/authStore'

/**
 * Guarda de rota: bloqueia acesso a rotas privadas sem sessão ativa,
 * redirecionando para /login (com ?redirect=). Equivalente ao
 * router.beforeEach global (Vue) / authGuard (Angular).
 *
 * Uso em AppRouter.tsx: envolve as rotas privadas com <ProtectedRoute />,
 * que renderiza <Outlet /> (as rotas filhas) só se autenticado.
 */
export function ProtectedRoute() {
  const isAuthenticated = useAuthStore((state) => !!state.token)
  const location = useLocation()

  if (!isAuthenticated) {
    return <Navigate to="/login" replace state={{ redirect: location.pathname }} />
  }

  return <Outlet />
}
