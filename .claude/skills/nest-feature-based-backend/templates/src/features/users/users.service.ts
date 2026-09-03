import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { DeepPartial, Repository } from 'typeorm'
import * as bcrypt from 'bcryptjs'

import { BaseService } from '@/common/services/base.service'
import { User } from '@/features/users/entities/user.entity'

/**
 * Service da feature "users".
 *
 * Exemplo de feature CRUD "convencional": basta estender o BaseService
 * passando o Repository da entidade. getAll/getById/create/update/delete
 * já vêm prontos.
 *
 * `create`/`update` são sobrescritos só para fazer o hash da senha antes de
 * persistir — o resto do comportamento (validação de existência no update,
 * 404 no delete, paginação no getAll...) continua vindo do BaseService.
 * `findByEmail` é um método extra que foge do CRUD padrão, usado pelo
 * AuthService no login.
 */
@Injectable()
export class UsersService extends BaseService<User> {
  constructor(@InjectRepository(User) repository: Repository<User>) {
    super(repository)
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.repository.findOneBy({ email })
  }

  override async create(data: DeepPartial<User>): Promise<User> {
    const password = data.password ? await bcrypt.hash(data.password, 10) : data.password
    return super.create({ ...data, password })
  }

  override async update(id: string, data: DeepPartial<User>): Promise<User> {
    const password = data.password ? await bcrypt.hash(data.password, 10) : undefined
    return super.update(id, password ? { ...data, password } : data)
  }
}
