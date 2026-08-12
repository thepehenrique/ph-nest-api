import {
  ForbiddenException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';

import { UsersService } from '../users/users.service';
import { LoginDto } from './dto/login.dto';
import { LoginResponseDto } from './dto/login-response.dto';
import { RefreshTokenService } from './services/refresh-token.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
    private readonly refreshTokenService: RefreshTokenService,
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

  async logout(refreshToken: string): Promise<void> {
    await this.refreshTokenService.revoke(refreshToken);
  }
}
