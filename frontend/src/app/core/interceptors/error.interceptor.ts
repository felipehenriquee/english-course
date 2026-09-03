import { inject } from '@angular/core'
import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http'
import { Router } from '@angular/router'
import { catchError, throwError } from 'rxjs'

import { toAppError } from '@app/core/errors/app-error'

/**
 * Interceptor funcional: trata erros de forma centralizada.
 * - 401 -> limpa o token e redireciona para /login (sessão expirada/inválida).
 * - Demais erros -> converte a resposta da API em `AppError`, montando a
 *   mensagem a partir do `code`/`params` (catálogo em core/errors) antes de
 *   propagar pro service/store.
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

      return throwError(() => toAppError(error))
    }),
  )
}
