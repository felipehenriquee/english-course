import { HttpInterceptorFn } from '@angular/common/http'

/**
 * Interceptor funcional: injeta o Bearer token em toda requisição HTTP.
 * Equivalente ao interceptor de request do Axios na versão Vue.
 */
export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const token = localStorage.getItem('auth_token')

  if (!token) return next(req)

  return next(
    req.clone({
      setHeaders: { Authorization: `Bearer ${token}` },
    }),
  )
}
