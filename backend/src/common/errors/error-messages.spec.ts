import { NotFoundException } from '@nestjs/common'

import {
  ConflictError,
  ERROR_MESSAGES,
  NotFoundError,
  interpolate,
  resolveErrorMessage,
} from '@/common/errors'

describe('catálogo de erros', () => {
  describe('interpolate', () => {
    it('troca {{chave}} pelo valor correspondente em params', () => {
      expect(interpolate('{{entity}} não encontrado', { entity: 'Usuário' })).toBe(
        'Usuário não encontrado',
      )
    })

    it('mantém o placeholder quando não há valor pra ele', () => {
      expect(interpolate('{{entity}} não encontrado')).toBe('{{entity}} não encontrado')
    })
  })

  describe('resolveErrorMessage', () => {
    it('monta a mensagem a partir do code + params', () => {
      expect(resolveErrorMessage('not_found', { entity: 'Curso' })).toBe('Curso não encontrado')
    })
  })

  describe('NotFoundError', () => {
    it('é um NotFoundException (404) com code/params estruturados', () => {
      const err = new NotFoundError('Usuário', { id: '123' })

      expect(err).toBeInstanceOf(NotFoundException)
      expect(err.getStatus()).toBe(404)
      expect(err.code).toBe('not_found')
      expect(err.params).toEqual({ entity: 'Usuário', id: '123' })
      expect(err.getResponse()).toEqual({
        code: 'not_found',
        params: { entity: 'Usuário', id: '123' },
        message: 'Usuário não encontrado',
      })
    })
  })

  describe('ConflictError', () => {
    it('usa o template do code informado', () => {
      const err = new ConflictError('email_already_registered')

      expect(err.getStatus()).toBe(409)
      expect(err.message).toBe(ERROR_MESSAGES.email_already_registered)
    })
  })
})
