import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
} from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiConflictResponse,
  ApiNoContentResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';

import { CreateUserDto } from './dto/create-user.dto';
import { UserEntity } from './entities/users.entity';
import { UsersService } from './users.service';
import { ErrorResponseDto } from 'src/common/dto/error-response.dto';

@ApiTags('Users')
@Controller('users')
export class UsersController {
  constructor(private readonly service: UsersService) {}

  @Post()
  @ApiOperation({
    summary: 'Cadastrar usuário',
  })
  @ApiBadRequestResponse({ type: ErrorResponseDto })
  @ApiConflictResponse({ type: ErrorResponseDto })
  async create(@Body() body: CreateUserDto): Promise<number> {
    return this.service.create(body);
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Buscar usuário por ID',
  })
  @ApiBadRequestResponse({ type: ErrorResponseDto })
  @ApiNotFoundResponse({ type: ErrorResponseDto })
  @ApiOkResponse({
    type: UserEntity,
  })
  async findById(@Param('id', ParseIntPipe) id: number): Promise<UserEntity> {
    return this.service.findById(id);
  }

  @Delete(':id')
  @ApiOperation({
    summary: 'Excluir usuário',
  })
  @ApiNoContentResponse()
  @ApiBadRequestResponse({ type: ErrorResponseDto })
  @ApiNotFoundResponse({ type: ErrorResponseDto })
  async deleteById(@Param('id', ParseIntPipe) id: number): Promise<void> {
    return this.service.deleteById(id);
  }
}
