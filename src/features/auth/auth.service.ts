import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { LoginDto } from './dto/login.dto';
import { LoginResponseDto } from './dto/login-response.dto';
import { RefreshTokenService } from './services/refresh-token.service';
import { UsersService } from '../users/services/users.service';
import { VerifyEmailDto } from '../users/dto/verify-email.dto';
import { EmailVerificationService } from 'src/infrastructure/verification/email-verification.service';
import { ResendVerificationDto } from '../users/dto/resend-verification.dto';
import { EmailQueue } from 'src/infrastructure/queue/email.queue';
import { ForgotPasswordDto } from './dto/forgot-password.dto';
import { PasswordResetService } from './services/password-reset.service';
import { ResetPasswordDto } from '../users/dto/reset-password.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
    private readonly refreshTokenService: RefreshTokenService,
    private readonly emailVerificationService: EmailVerificationService,
    private readonly emailQueue: EmailQueue,
    private readonly passwordResetService: PasswordResetService,
  ) {}

  async login(bodyDto: LoginDto): Promise<LoginResponseDto> {
    const user = await this.usersService.findByEmail(bodyDto.email);

    if (!user) {
      throw new UnauthorizedException('E-mail ou senha inválidos.');
    }

    const passwordIsValid = await bcrypt.compare(
      bodyDto.password,
      user.password,
    );

    if (!passwordIsValid) {
      throw new UnauthorizedException('E-mail ou senha inválidos.');
    }

    if (!user.isEmailVerified) {
      throw new ForbiddenException('E-mail não confirmado.');
    }

    if (!user.isActive) {
      throw new ForbiddenException('Usuário inativo.');
    }

    const payload = {
      sub: user.id,
      email: user.email,
      role: user.role.name,
    };

    const accessToken = await this.jwtService.signAsync(payload);

    const refreshToken = this.refreshTokenService.generate();

    await this.refreshTokenService.store(user.id, refreshToken);

    return {
      accessToken,
      refreshToken,
    };
  }

  async refresh(refreshToken: string) {
    const userId = await this.refreshTokenService.getUserId(refreshToken);

    if (!userId) {
      throw new UnauthorizedException('Refresh token inválido ou expirado.');
    }

    const user = await this.usersService.findById(userId);

    if (!user) {
      throw new UnauthorizedException('Usuário não encontrado.');
    }

    if (!user.isActive) {
      throw new UnauthorizedException('Usuário inativo.');
    }

    await this.refreshTokenService.revoke(refreshToken);

    const newRefreshToken = this.refreshTokenService.generate();

    await this.refreshTokenService.store(user.id, newRefreshToken);

    const payload = {
      sub: user.id,
      email: user.email,
      role: user.role.name,
    };

    const accessToken = await this.jwtService.signAsync(payload);

    return {
      accessToken,
      refreshToken: newRefreshToken,
    };
  }

  async verifyEmail(verifyEmailDto: VerifyEmailDto): Promise<void> {
    const user = await this.usersService.findByEmail(verifyEmailDto.email);

    if (!user) {
      throw new NotFoundException('Usuário não encontrado.');
    }

    if (user.isEmailVerified) {
      throw new BadRequestException('E-mail já confirmado.');
    }

    const storedCode = await this.emailVerificationService.getCode(user.id);

    if (!storedCode) {
      throw new BadRequestException('Código expirado ou inexistente.');
    }

    if (storedCode !== verifyEmailDto.code) {
      throw new BadRequestException('Código de confirmação inválido.');
    }

    user.isEmailVerified = true;

    await this.usersService.update(user);

    await this.emailVerificationService.deleteCode(user.id);
  }

  async resendVerificationEmail(
    resendVerificationDto: ResendVerificationDto,
  ): Promise<void> {
    const user = await this.usersService.findByEmail(
      resendVerificationDto.email,
    );

    if (!user) {
      throw new UnauthorizedException('E-mail ou senha inválidos.');
    }

    if (user.isEmailVerified) {
      throw new BadRequestException('E-mail já confirmado.');
    }

    const code = this.emailVerificationService.generateCode();

    await this.emailVerificationService.saveCode(user.id, code);

    await this.emailQueue.addVerificationEmail(user.id, user.email, code);
  }

  async forgotPassword(
    forgotPasswordDto: ForgotPasswordDto,
  ): Promise<{ message: string }> {
    const user = await this.usersService.findByEmail(forgotPasswordDto.email);

    if (!user || !user.isEmailVerified) {
      return {
        message:
          'Se o e-mail estiver cadastrado, você receberá um código para redefinir sua senha.',
      };
    }

    const resetCode = this.passwordResetService.generateCode();

    await this.passwordResetService.saveCode(user.id, resetCode);

    await this.emailQueue.addPasswordResetEmail(user.id, user.email, resetCode);

    return {
      message:
        'Se o e-mail estiver cadastrado, você receberá um código para redefinir sua senha.',
    };
  }

  async resetPassword(resetPasswordDto: ResetPasswordDto): Promise<void> {
    const user = await this.usersService.findByEmail(resetPasswordDto.email);

    if (!user) {
      throw new BadRequestException(
        'Código de recuperação inválido ou expirado.',
      );
    }

    const storedCode = await this.passwordResetService.getCode(user.id);

    if (!storedCode) {
      throw new BadRequestException(
        'Código de recuperação inválido ou expirado.',
      );
    }

    if (storedCode !== resetPasswordDto.code) {
      throw new BadRequestException(
        'Código de recuperação inválido ou expirado.',
      );
    }

    user.password = await bcrypt.hash(resetPasswordDto.password, 10);

    await this.usersService.update(user);

    await this.passwordResetService.deleteCode(user.id);
  }

  async logout(refreshToken: string): Promise<void> {
    await this.refreshTokenService.revoke(refreshToken);
  }
}
