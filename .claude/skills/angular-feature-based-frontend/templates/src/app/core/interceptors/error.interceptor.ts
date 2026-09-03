import { inject } from '@angular/core'
import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http'
import { Router } from '@angular/router'
import { catchError, throwError } from 'rxjs'

/**
 * Interceptor funcional: trata erros de forma centralizada.
 * - 401 -> limpa o token e redireciona para /login (sessão expirada/inválida).
 * - Demais erros -> normaliza a mensagem antes de propagar pro service/store.
 * Equivalente ao interceptor de response do Axios na versão Vue.
 */
export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  const router = inject(Router)

  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      if (error.status === 401) {
        localStorage.removeItem('auth_token')
        if (!router.url.startsWith('/login')) {
          router.navigate(['/login'])
        }
      }

      const message = error.error?.message ?? error.message ?? 'Erro inesperado ao comunicar com a API'
      return throwError(() => new Error(message))
    }),
  )
}
