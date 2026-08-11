import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiConflictResponse,
  ApiNoContentResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';

import { CreateUserDto } from './dto/create-user.dto';
import { UserEntity } from './entities/users.entity';
import { UsersService } from './users.service';
import { ErrorResponseDto } from 'src/common/dto/error-response.dto';
import { Roles } from '../auth/decorators/roles.decorators';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { ROLES } from 'src/common/constants/roles.constants';

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
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Buscar usuário por ID',
  })
  @ApiUnauthorizedResponse({ type: ErrorResponseDto })
  @ApiBadRequestResponse({ type: ErrorResponseDto })
  @ApiNotFoundResponse({ type: ErrorResponseDto })
  @ApiOkResponse({
    type: UserEntity,
  })
  async findById(@Param('id', ParseIntPipe) id: number): Promise<UserEntity> {
    return this.service.findById(id);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(ROLES.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Excluir usuário',
  })
  @ApiNoContentResponse()
  @ApiBadRequestResponse({ type: ErrorResponseDto })
  @ApiUnauthorizedResponse({ type: ErrorResponseDto })
  @ApiNotFoundResponse({ type: ErrorResponseDto })
  async deleteById(@Param('id', ParseIntPipe) id: number): Promise<void> {
    return this.service.deleteById(id);
  }
}
