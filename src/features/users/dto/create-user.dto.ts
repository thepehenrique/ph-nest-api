import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsNotEmpty,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';
import { UserEntity } from '../entities/users.entity';

export class CreateUserDto {
  @ApiProperty({
    description: 'Nome do usuário',
    maxLength: 255,
  })
  @IsNotEmpty()
  @IsString()
  @MaxLength(255)
  name: string;

  @ApiProperty({
    description: 'E-mail do usuário',
    maxLength: 255,
  })
  @IsNotEmpty()
  @IsEmail()
  @MaxLength(255)
  email: string;

  @ApiProperty({
    description: 'Senha do usuário',
    minLength: 8,
    maxLength: 255,
  })
  @IsNotEmpty()
  @IsString()
  @MinLength(8)
  @MaxLength(255)
  password: string;

  constructor(init?: Partial<CreateUserDto>) {
    Object.assign(this, init);
  }

  asEntity(date: Date, entityRef: UserEntity): UserEntity {
    const entity = entityRef;

    if (!entity.id) {
      entity.createdAt = date;
      entity.isActive = true;
    }

    entity.updatedAt = date;

    Object.assign(entity, {
      ...this,
    });

    return entity;
  }
}
