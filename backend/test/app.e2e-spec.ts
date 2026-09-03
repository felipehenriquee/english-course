import { INestApplication } from '@nestjs/common'
import { Test, TestingModule } from '@nestjs/testing'
import request, { Response } from 'supertest'
import type { Server } from 'http'

import { AppModule } from '@/app.module'

describe('Health (e2e)', () => {
  let app: INestApplication

  beforeAll(async () => {
    // Requer um banco acessível (ver .env) — se preferir rodar sem banco,
    // troque AppModule por um módulo de teste que só importe HealthModule.
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile()

    app = moduleFixture.createNestApplication()
    app.setGlobalPrefix('api')
    await app.init()
  })

  afterAll(async () => {
    await app.close()
  })

  it('/api/health (GET) responde ok', () => {
    return request(app.getHttpServer() as Server)
      .get('/api/health')
      .expect(200)
      .expect((res: Response) => {
        expect((res.body as { status: string }).status).toBe('ok')
      })
  })
})
