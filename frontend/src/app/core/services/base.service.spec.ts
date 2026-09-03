import { TestBed } from '@angular/core/testing'
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing'
import { provideHttpClient } from '@angular/common/http'
import { Injectable } from '@angular/core'
import { environment } from '@env/environment'
import { BaseService } from '@app/core/services/base.service'
import type { BaseEntity } from '@app/core/models/api.model'

interface Product extends BaseEntity {
  name: string
}

@Injectable()
class ProductService extends BaseService<Product> {
  protected override resource = '/products'
}

describe('BaseService (CRUD genérico)', () => {
  let service: ProductService
  let httpMock: HttpTestingController

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ProductService, provideHttpClient(), provideHttpClientTesting()],
    })
    service = TestBed.inject(ProductService)
    httpMock = TestBed.inject(HttpTestingController)
  })

  afterEach(() => httpMock.verify())

  it('getAll faz GET no endpoint do recurso', () => {
    service.getAll().subscribe((result) => {
      expect(result).toEqual([{ id: 1, name: 'Mouse' }])
    })

    const req = httpMock.expectOne(`${environment.apiBaseUrl}/products`)
    expect(req.request.method).toBe('GET')
    req.flush([{ id: 1, name: 'Mouse' }])
  })

  it('create faz POST com o payload informado', () => {
    const payload = { name: 'Teclado' }

    service.create(payload).subscribe((result) => {
      expect(result).toEqual({ id: 2, ...payload })
    })

    const req = httpMock.expectOne(`${environment.apiBaseUrl}/products`)
    expect(req.request.method).toBe('POST')
    expect(req.request.body).toEqual(payload)
    req.flush({ id: 2, ...payload })
  })

  it('delete faz DELETE no id informado', () => {
    service.delete(1).subscribe()

    const req = httpMock.expectOne(`${environment.apiBaseUrl}/products/1`)
    expect(req.request.method).toBe('DELETE')
    req.flush(null)
  })
})
