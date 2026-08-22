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
  ApiNoContentResponse,
} from '@nestjs/swagger';
import { ErrorResponseDto } from 'src/common/dto/error-response.dto';
import { AuthService } from './auth.service';
import { LoginResponseDto } from './dto/login-response.dto';
import { LoginDto } from './dto/login.dto';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { AuthenticatedUserDto } from './dto/authenticated-user.dto';
import type { AuthenticatedRequest } from './dto/authenticated-request.dto';
import { RefreshTokenDto } from './dto/refresh-token.dto';
import { RateLimitGuard } from 'src/infrastructure/rate-limit/rate-limit.guard';
import { RateLimit } from 'src/infrastructure/rate-limit/rate-limit.decorator';
import { VerifyEmailDto } from '../users/dto/verify-email.dto';
import { ResendVerificationDto } from '../users/dto/resend-verification.dto';
import { ForgotPasswordDto } from './dto/forgot-password.dto';
import { ResetPasswordDto } from '../users/dto/reset-password.dto';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly service: AuthService) {}

  @Post('login')
  @UseGuards(RateLimitGuard)
  @RateLimit(5, 60)
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

  @Post('refresh')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Renovar token de acesso',
  })
  @ApiOkResponse({
    type: LoginResponseDto,
  })
  @ApiUnauthorizedResponse({
    type: ErrorResponseDto,
  })
  async refresh(@Body() bodyDto: RefreshTokenDto): Promise<LoginResponseDto> {
    return this.service.refresh(bodyDto.refreshToken);
  }

  @Post('verify-email')
  @ApiOperation({
    summary: 'Enviar código para validar o email',
  })
  async verifyEmail(@Body() verifyEmailDto: VerifyEmailDto): Promise<void> {
    await this.service.verifyEmail(verifyEmailDto);
  }

  @Post('resend-verification')
  @ApiOperation({
    summary: 'Reenviar o código de verificação do email',
  })
  @RateLimit(1, 60)
  async resendVerificationEmail(
    @Body() resendVerificationDto: ResendVerificationDto,
  ): Promise<void> {
    await this.service.resendVerificationEmail(resendVerificationDto);
  }

  @Post('forgot-password')
  @RateLimit(1, 60)
  @ApiOperation({
    summary: 'Enviar o código de alteração de senha.',
  })
  async forgotPassword(
    @Body() forgotPasswordDto: ForgotPasswordDto,
  ): Promise<void> {
    await this.service.forgotPassword(forgotPasswordDto);
  }

  @Post('reset-password')
  @ApiOperation({
    summary: 'Alterar senha',
  })
  async resetPassword(
    @Body() resetPasswordDto: ResetPasswordDto,
  ): Promise<void> {
    await this.service.resetPassword(resetPasswordDto);
  }

  @Post('logout')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({
    summary: 'Encerrar sessão',
  })
  @ApiNoContentResponse()
  async logout(@Body() bodyDto: RefreshTokenDto): Promise<void> {
    await this.service.logout(bodyDto.refreshToken);
  }
}
