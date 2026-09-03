import { HttpErrorResponse } from '@angular/common/http'

import { AppError, toAppError } from '@app/core/errors/app-error'
import { interpolate, resolveErrorMessage } from '@app/core/errors/error-messages'

describe('catálogo de erros (frontend)', () => {
  describe('interpolate', () => {
    it('troca {{chave}} pelo valor de params', () => {
      expect(interpolate('{{entity}} não encontrado', { entity: 'Curso' })).toBe(
        'Curso não encontrado',
      )
    })
  })

  describe('resolveErrorMessage', () => {
    it('usa o template do catálogo quando o code é conhecido', () => {
      expect(resolveErrorMessage('not_found', { entity: 'Usuário' })).toBe('Usuário não encontrado')
    })

    it('cai pra mensagem da API quando o code é desconhecido', () => {
      expect(resolveErrorMessage('algo_novo', {}, 'Mensagem crua da API')).toBe(
        'Mensagem crua da API',
      )
    })
  })

  describe('toAppError', () => {
    it('monta a mensagem a partir do code/params do corpo da resposta', () => {
      const httpError = new HttpErrorResponse({
        status: 404,
        error: { statusCode: 404, code: 'not_found', params: { entity: 'Usuário' } },
      })

      const appError = toAppError(httpError)

      expect(appError).toBeInstanceOf(AppError)
      expect(appError.message).toBe('Usuário não encontrado')
      expect(appError.code).toBe('not_found')
      expect(appError.status).toBe(404)
    })

    it('usa o message da API quando não há code reconhecido', () => {
      const httpError = new HttpErrorResponse({
        status: 400,
        error: { statusCode: 400, code: null, message: 'name must be a string' },
      })

      expect(toAppError(httpError).message).toBe('name must be a string')
    })
  })
})
