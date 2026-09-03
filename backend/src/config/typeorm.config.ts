import { ConfigService } from '@nestjs/config'
import { TypeOrmModuleOptions } from '@nestjs/typeorm'

import { User } from '@/features/users/entities/user.entity'

/**
 * Monta as opções do TypeORM a partir do .env. `DB_TYPE` decide o driver:
 *
 *   - postgres (default desta skill): precisa do pacote `pg` (já incluso)
 *   - mysql: `npm i mysql2` e remova o `pg` se não for usar mais
 *   - sqlite: `npm i better-sqlite3` (bom pra prototipagem/testes locais)
 *
 * Ver SKILL.md, Passo 0 — a skill deve perguntar qual banco usar ANTES de
 * gerar o projeto, e ajustar aqui + docker-compose.yml de acordo.
 *
 * Novas entidades: adicione a classe no array `entities` abaixo (ou troque
 * por autoLoadEntities, se preferir não listar manualmente).
 */
export function buildTypeOrmConfig(config: ConfigService): TypeOrmModuleOptions {
  const dbType = config.get<string>('DB_TYPE', 'postgres')
  const synchronize = config.get<string>('DB_SYNCHRONIZE', 'false') === 'true'
  const entities = [User]

  if (dbType === 'sqlite') {
    return {
      type: 'better-sqlite3',
      database: config.get<string>('DB_SQLITE_PATH', './data/app.sqlite'),
      entities,
      synchronize,
    }
  }

  const common = {
    host: config.get<string>('DB_HOST', 'localhost'),
    port: config.get<number>('DB_PORT', dbType === 'mysql' ? 3306 : 5432),
    username: config.get<string>('DB_USERNAME', 'postgres'),
    password: config.get<string>('DB_PASSWORD', 'postgres'),
    database: config.get<string>('DB_DATABASE', 'app'),
    entities,
    synchronize,
  }

  if (dbType === 'mysql') {
    return { type: 'mysql', ...common }
  }

  // default: postgres
  return { type: 'postgres', ...common }
}
