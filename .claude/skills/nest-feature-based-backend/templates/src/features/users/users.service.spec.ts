import { NotFoundException } from '@nestjs/common'
import { Test, TestingModule } from '@nestjs/testing'
import { getRepositoryToken } from '@nestjs/typeorm'

import { User } from '@/features/users/entities/user.entity'
import { UsersService } from '@/features/users/users.service'

// Repository "de mentira": só implementa os métodos que o BaseService usa.
const mockRepository = () => ({
  find: jest.fn(),
  findAndCount: jest.fn(),
  findOneBy: jest.fn(),
  create: jest.fn(),
  save: jest.fn(),
  delete: jest.fn(),
})

type MockRepository = ReturnType<typeof mockRepository>

describe('UsersService (herda BaseService)', () => {
  let service: UsersService
  let repository: MockRepository

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [UsersService, { provide: getRepositoryToken(User), useFactory: mockRepository }],
    }).compile()

    service = module.get(UsersService)
    repository = module.get(getRepositoryToken(User))
  })

  it('getAll pagina os resultados do repository', async () => {
    const users = [{ id: '1', name: 'Ada' } as User]
    repository.findAndCount.mockResolvedValue([users, 1])

    const result = await service.getAll({ page: 1, perPage: 20 })

    expect(repository.findAndCount).toHaveBeenCalledWith(
      expect.objectContaining({ skip: 0, take: 20 }),
    )
    expect(result).toEqual({ data: users, total: 1, page: 1, perPage: 20 })
  })

  it('getById lança NotFoundException quando o registro não existe', async () => {
    repository.findOneBy.mockResolvedValue(null)

    await expect(service.getById('id-inexistente')).rejects.toThrow(NotFoundException)
  })

  it('create faz hash da senha antes de salvar', async () => {
    repository.create.mockImplementation((data: Partial<User>) => data)
    repository.save.mockImplementation((data: Partial<User>) =>
      Promise.resolve({ id: '1', ...data }),
    )

    const result = await service.create({
      name: 'Ada',
      email: 'ada@example.com',
      password: 'senha-em-texto-puro',
      role: 'viewer',
      active: true,
    })

    expect(result.password).not.toBe('senha-em-texto-puro')
    expect(typeof result.password).toBe('string')
  })

  it('delete lança NotFoundException quando nada foi afetado', async () => {
    repository.delete.mockResolvedValue({ affected: 0, raw: [] })

    await expect(service.delete('id-inexistente')).rejects.toThrow(NotFoundException)
  })
})
