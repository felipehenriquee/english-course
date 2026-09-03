import { inject } from '@angular/core'
import { CanActivateFn, Router } from '@angular/router'
import { AuthStore } from '@app/features/auth/state/auth.store'

/**
 * Guarda funcional de rota: bloqueia acesso a rotas privadas sem sessão ativa,
 * redirecionando para /login (com returnUrl). Equivalente ao router.beforeEach
 * global da versão Vue.
 */
export const authGuard: CanActivateFn = (_route, state) => {
  const authStore = inject(AuthStore)
  const router = inject(Router)

  if (authStore.isAuthenticated()) return true

  return router.createUrlTree(['/login'], { queryParams: { redirect: state.url } })
}

/**
 * Guarda inversa: usada na rota de /login para impedir que um usuário já
 * autenticado volte pra tela de login.
 */
export const guestGuard: CanActivateFn = () => {
  const authStore = inject(AuthStore)
  const router = inject(Router)

  if (!authStore.isAuthenticated()) return true

  return router.createUrlTree(['/'])
}
