import { DeepPartial, FindOptionsOrder, FindOptionsWhere, ObjectLiteral, Repository } from 'typeorm'

import { PaginatedResponseDto } from '@/common/dto/paginated-response.dto'
import { PaginationQueryDto } from '@/common/dto/pagination-query.dto'
import { NotFoundError } from '@/common/errors'

/**
 * Service global de CRUD.
 *
 * Toda feature que expõe um recurso REST "convencional" (users, products,
 * orders...) deve criar um service que ESTENDE esta classe, passando o
 * Repository da entidade pro construtor. Ex: features/users/users.service.ts
 *
 *   @Injectable()
 *   export class UsersService extends BaseService<User> {
 *     constructor(@InjectRepository(User) repo: Repository<User>) {
 *       super(repo)
 *     }
 *   }
 *
 * Isso dá getAll/getById/create/update/delete prontos, e a feature só
 * precisa adicionar métodos extras que fujam do CRUD padrão (ex:
 * resendInvite, changePassword).
 */
export abstract class BaseService<T extends ObjectLiteral & { id: string }> {
  protected constructor(
    protected readonly repository: Repository<T>,
    /**
     * Nome "de exibição" da entidade, usado nas mensagens de erro (o
     * `{{entity}}` de `not_found`, por exemplo). Default: o nome da classe
     * da entidade no TypeORM ("User", "Product"...). Passe um label melhor
     * no `super()` da subclasse pra ter algo em PT: `super(repo, 'Usuário')`.
     */
    protected readonly entityLabel: string = repository.metadata?.name ?? 'Registro',
  ) {}

  /** Lista registros com paginação. Sobrescreva em subclasses para busca/filtros específicos. */
  async getAll(query: Partial<PaginationQueryDto> = {}): Promise<PaginatedResponseDto<T>> {
    const page = query.page ?? 1
    const perPage = query.perPage ?? 20

    const [data, total] = await this.repository.findAndCount({
      skip: (page - 1) * perPage,
      take: perPage,
      order: query.sort
        ? ({ [query.sort]: query.order ?? 'ASC' } as FindOptionsOrder<T>)
        : undefined,
    })

    return new PaginatedResponseDto(data, total, page, perPage)
  }

  /** Busca um único registro pelo id. Lança 404 se não existir. */
  async getById(id: string): Promise<T> {
    const entity = await this.repository.findOneBy({ id } as FindOptionsWhere<T>)
    if (!entity) {
      throw new NotFoundError(this.entityLabel, { id })
    }
    return entity
  }

  /** Cria um novo registro. */
  async create(data: DeepPartial<T>): Promise<T> {
    const entity = this.repository.create(data)
    return this.repository.save(entity)
  }

  /** Atualiza parcialmente um registro existente (equivalente a PATCH). Lança 404 se não existir. */
  async update(id: string, data: DeepPartial<T>): Promise<T> {
    const entity = await this.getById(id)
    Object.assign(entity, data)
    return this.repository.save(entity)
  }

  /** Remove um registro pelo id. Lança 404 se não existir. */
  async delete(id: string): Promise<void> {
    const result = await this.repository.delete(id)
    if (!result.affected) {
      throw new NotFoundError(this.entityLabel, { id })
    }
  }
}
