import type { UserEntity } from '../entities/users.entity';
import { UserResponseDto } from './user-response.dto';

describe('UserResponseDto', () => {
  it('does not expose sensitive user fields', () => {
    const user = {
      id: 1,
      name: 'Maria',
      email: 'maria@example.com',
      password: 'hashed-password',
      isActive: true,
      isEmailVerified: true,
      roleId: 1,
      createdAt: new Date(),
      updatedAt: new Date(),
    } as UserEntity;

    expect(UserResponseDto.fromEntity(user)).toEqual({
      id: 1,
      name: 'Maria',
      email: 'maria@example.com',
      isActive: true,
    });
  });
});
