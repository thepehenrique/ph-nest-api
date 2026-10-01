import { ApiProperty } from '@nestjs/swagger';
import type { UserEntity } from '../entities/users.entity';

export class UserResponseDto {
  @ApiProperty()
  id: number;

  @ApiProperty()
  name: string;

  @ApiProperty()
  email: string;

  @ApiProperty()
  isActive: boolean;

  static fromEntity(user: UserEntity): UserResponseDto {
    return {
      id: user.id,
      name: user.name,
      email: user.email,
      isActive: user.isActive,
    };
  }
}
