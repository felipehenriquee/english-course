import { describe, expect, it, vi, beforeEach } from 'vitest'
import { BaseService } from '@/services/BaseService'
import { http } from '@/services/http'
import type { BaseEntity } from '@/types/api'

interface Product extends BaseEntity {
  name: string
}

class ProductService extends BaseService<Product> {
  constructor() {
    super('/products')
  }
}

describe('BaseService (CRUD genérico)', () => {
  const service = new ProductService()

  beforeEach(() => {
    vi.restoreAllMocks()
  })

  it('getAll faz GET no endpoint do recurso', async () => {
    const spy = vi.spyOn(http, 'get').mockResolvedValue({ data: [{ id: 1, name: 'Mouse' }] })

    const result = await service.getAll()

    expect(spy).toHaveBeenCalledWith('/products', { params: undefined })
    expect(result).toEqual([{ id: 1, name: 'Mouse' }])
  })

  it('create faz POST com o payload informado', async () => {
    const payload = { name: 'Teclado' }
    const spy = vi.spyOn(http, 'post').mockResolvedValue({ data: { id: 2, ...payload } })

    const result = await service.create(payload)

    expect(spy).toHaveBeenCalledWith('/products', payload)
    expect(result).toEqual({ id: 2, name: 'Teclado' })
  })

  it('delete faz DELETE no id informado', async () => {
    const spy = vi.spyOn(http, 'delete').mockResolvedValue({ data: undefined })

    await service.delete(1)

    expect(spy).toHaveBeenCalledWith('/products/1')
  })
})
