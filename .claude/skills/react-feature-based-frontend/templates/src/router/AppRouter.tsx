import { Route, Routes } from 'react-router-dom'

import { ProtectedRoute } from '@/router/ProtectedRoute'
import { GuestRoute } from '@/router/GuestRoute'
import { AuthLayout } from '@/layouts/AuthLayout'
import { DefaultLayout } from '@/layouts/DefaultLayout'
import { LoginPage } from '@/features/auth/pages/LoginPage'
import { HomePage } from '@/features/home/pages/HomePage'
import { UsersListPage } from '@/features/users/pages/UsersListPage'
import { NotFoundPage } from '@/shared/NotFoundPage'

/**
 * Rotas raiz da aplicação (equivalente ao router/index.ts do Vue e
 * app.routes.ts do Angular). Cada bloco de rotas escolhe seu layout
 * (AuthLayout / DefaultLayout) e passa pela guarda correspondente.
 */
export function AppRouter() {
  return (
    <Routes>
      <Route element={<GuestRoute />}>
        <Route element={<AuthLayout />}>
          <Route path="/login" element={<LoginPage />} />
        </Route>
      </Route>

      <Route element={<ProtectedRoute />}>
        <Route element={<DefaultLayout />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/users" element={<UsersListPage />} />
        </Route>
      </Route>

      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  )
}
