import 'dotenv/config'
import { DataSource } from 'typeorm'

import { Course } from '@/features/courses/entities/course.entity'
import { Unit } from '@/features/units/entities/unit.entity'
import { User } from '@/features/users/entities/user.entity'

/**
 * DataSource usado SÓ pela CLI do TypeORM (migration:generate/run/revert —
 * ver scripts no package.json). Separado do TypeOrmModule.forRootAsync
 * (config/typeorm.config.ts) porque a CLI roda fora do contexto de DI do
 * Nest e precisa ler o .env diretamente.
 */
export const AppDataSource = new DataSource({
  type: (process.env.DB_TYPE as 'postgres' | 'mysql') ?? 'postgres',
  host: process.env.DB_HOST ?? 'localhost',
  port: Number(process.env.DB_PORT ?? 5432),
  username: process.env.DB_USERNAME ?? 'postgres',
  password: process.env.DB_PASSWORD ?? 'postgres',
  database: process.env.DB_DATABASE ?? 'app',
  entities: [User, Course, Unit],
  migrations: ['src/migrations/*.ts'],
  synchronize: false,
})
