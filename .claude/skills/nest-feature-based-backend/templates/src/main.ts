import { ClassSerializerInterceptor, Logger, ValidationPipe } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { NestFactory, Reflector } from '@nestjs/core'
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger'
import compression from 'compression'
import helmet from 'helmet'

import { AppModule } from '@/app.module'
import { HttpExceptionFilter } from '@/common/filters/http-exception.filter'
import { LoggingInterceptor } from '@/common/interceptors/logging.interceptor'

async function bootstrap() {
  const app = await NestFactory.create(AppModule)
  const config = app.get(ConfigService)

  // Cabeçalhos de segurança básicos + compressão de resposta.
  // Papel parecido com os headers/gzip configurados no nginx.conf das
  // skills de frontend, só que aqui na própria API.
  app.use(helmet())
  app.use(compression())

  // CORS liberado só pras origens do(s) frontend(s) (ver .env -> CORS_ORIGIN)
  app.enableCors({
    origin: config.get<string>('CORS_ORIGIN', '').split(',').filter(Boolean),
    credentials: true,
  })

  // Prefixo global: API fica em /api (bate com VITE_API_BASE_URL /
  // apiBaseUrl usados nas 3 skills de frontend)
  const apiPrefix = config.get<string>('API_PREFIX', 'api')
  app.setGlobalPrefix(apiPrefix)

  // Validação automática de DTOs (class-validator) em todo endpoint.
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // remove campos que não existem no DTO
      forbidNonWhitelisted: true, // erro se mandar campo a mais
      transform: true, // converte payload pro tipo do DTO (ex: string -> number)
    }),
  )

  app.useGlobalFilters(new HttpExceptionFilter())
  app.useGlobalInterceptors(
    // Aplica os decorators @Exclude() das entidades (ex: User.password) em
    // toda resposta — sem isso o hash da senha vazaria em GET /users.
    new ClassSerializerInterceptor(app.get(Reflector)),
    new LoggingInterceptor(),
  )

  // Swagger em /api/docs (ajuste/remova em produção se não quiser expor)
  const swaggerConfig = new DocumentBuilder()
    .setTitle(config.get<string>('APP_NAME', 'API'))
    .setDescription('Documentação gerada automaticamente pelo @nestjs/swagger')
    .setVersion('1.0')
    .addBearerAuth()
    .build()
  const document = SwaggerModule.createDocument(app, swaggerConfig)
  SwaggerModule.setup(`${apiPrefix}/docs`, app, document)

  const port = config.get<number>('PORT', 3000)
  await app.listen(port)

  const logger = new Logger('Bootstrap')
  logger.log(`🚀 API rodando em http://localhost:${port}/${apiPrefix}`)
  logger.log(`📚 Swagger em http://localhost:${port}/${apiPrefix}/docs`)
}

void bootstrap()
