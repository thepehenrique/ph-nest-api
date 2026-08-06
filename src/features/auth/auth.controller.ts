import {
  Controller,
  Post,
  HttpCode,
  HttpStatus,
  Body,
  Get,
  Req,
  UseGuards,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiOkResponse,
  ApiUnauthorizedResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { ErrorResponseDto } from 'src/common/dto/error-response.dto';
import { AuthService } from './auth.service';
import { LoginResponseDto } from './dto/login-response.dto';
import { LoginDto } from './dto/login.dto';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { AuthenticatedUserDto } from './dto/authenticated-user.dto';
import type { AuthenticatedRequest } from './dto/authenticated-request.dto';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly service: AuthService) {}

  @Post('login')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Autenticar usuário',
  })
  @ApiOkResponse({
    type: LoginResponseDto,
  })
  @ApiUnauthorizedResponse({
    type: ErrorResponseDto,
  })
  async login(@Body() bodyDto: LoginDto): Promise<LoginResponseDto> {
    return this.service.login(bodyDto);
  }

  @Get('me')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Retornar usuário autenticado',
  })
  @ApiOkResponse({
    type: AuthenticatedUserDto,
  })
  me(@Req() request: AuthenticatedRequest) {
    return AuthenticatedUserDto.fromEntity(request.user);
  }
}
