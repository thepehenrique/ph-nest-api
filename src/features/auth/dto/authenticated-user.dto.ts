import { ApiProperty } from '@nestjs/swagger';
import { UserEntity } from 'src/features/users/entities/users.entity';

export class AuthenticatedUserDto {
  @ApiProperty({})
  id: number;

  @ApiProperty({})
  name: string;

  @ApiProperty({})
  email: string;

  @ApiProperty({})
  isActive: boolean;

  @ApiProperty({})
  role: string;

  static fromEntity(user: UserEntity): AuthenticatedUserDto {
    return {
      id: user.id,
      name: user.name,
      email: user.email,
      isActive: user.isActive,
      role: user.role.name,
    };
  }
}
