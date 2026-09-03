import { Controller, Get } from '@nestjs/common'
import { ApiTags } from '@nestjs/swagger'

import { Public } from '@/common/decorators/public.decorator'

/**
 * Endpoint simples de healthcheck, usado pelo HEALTHCHECK do Dockerfile e
 * por orquestradores (k8s liveness/readiness probe, load balancer...).
 * Equivalente ao /healthz configurado no nginx.conf das skills de frontend.
 */
@ApiTags('health')
@Controller('health')
export class HealthController {
  @Public()
  @Get()
  check() {
    return { status: 'ok', timestamp: new Date().toISOString() }
  }
}
