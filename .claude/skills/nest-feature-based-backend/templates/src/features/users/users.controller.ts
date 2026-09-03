import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common'
import { ApiBearerAuth, ApiOkResponse, ApiTags } from '@nestjs/swagger'

import { PaginationQueryDto } from '@/common/dto/pagination-query.dto'
import { PaginatedResponseDto } from '@/common/dto/paginated-response.dto'
import { User } from '@/features/users/entities/user.entity'
import { UsersService } from '@/features/users/users.service'
import { CreateUserDto } from '@/features/users/dto/create-user.dto'
import { UpdateUserDto } from '@/features/users/dto/update-user.dto'

/**
 * Endpoints REST "convencionais" (GET/POST/PATCH/DELETE em /users) — o
 * mesmo contrato que o userService (BaseService) das 3 skills de frontend
 * já chama: getAll -> GET /users, getById -> GET /users/:id,
 * create -> POST /users, update -> PATCH /users/:id, delete -> DELETE /users/:id.
 */
@ApiTags('users')
@ApiBearerAuth()
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  @ApiOkResponse({ type: PaginatedResponseDto })
  getAll(@Query() query: PaginationQueryDto): Promise<PaginatedResponseDto<User>> {
    return this.usersService.getAll(query)
  }

  @Get(':id')
  @ApiOkResponse({ type: User })
  getById(@Param('id') id: string): Promise<User> {
    return this.usersService.getById(id)
  }

  @Post()
  @ApiOkResponse({ type: User })
  create(@Body() dto: CreateUserDto): Promise<User> {
    return this.usersService.create(dto)
  }

  @Patch(':id')
  @ApiOkResponse({ type: User })
  update(@Param('id') id: string, @Body() dto: UpdateUserDto): Promise<User> {
    return this.usersService.update(id, dto)
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  delete(@Param('id') id: string): Promise<void> {
    return this.usersService.delete(id)
  }
}
