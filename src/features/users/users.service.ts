import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import * as bcrypt from 'bcrypt';

import { CreateUserDto } from './dto/create-user.dto';
import { UserEntity } from './entities/users.entity';
import { UsersRepository } from './repositories/users.repository';
import { RolesService } from '../roles/roles.service';
import { ROLES } from 'src/common/constants/roles.constants';
import { EmailQueue } from 'src/infrastructure/queue/email.queue';
import { UserResponseDto } from './dto/user-response.dto';

@Injectable()
export class UsersService {
  constructor(
    private readonly repository: UsersRepository,
    private readonly rolesService: RolesService,
    private readonly emailQueue: EmailQueue,
  ) {}

  async create(bodyDto: CreateUserDto): Promise<number> {
    const date = new Date();
    const entity = new UserEntity();

    const userExists = await this.repository.findByEmail(bodyDto.email);

    if (userExists) {
      throw new ConflictException('E-mail já cadastrado.');
    }

    const role = await this.rolesService.findByName(ROLES.USER);

    bodyDto.password = await bcrypt.hash(bodyDto.password, 10);

    const user = new CreateUserDto(bodyDto).asEntity(date, entity);

    user.role = role;

    await this.repository.save(user);

    await this.emailQueue.addWelcomeEmail(user.id, bodyDto.email);

    return user.id;
  }

  async findById(id: number): Promise<UserEntity> {
    const user = await this.repository.findById(id);

    if (!user) {
      throw new NotFoundException('Usuário não encontrado.');
    }

    return user;
  }

  async findAll(): Promise<UserResponseDto[]> {
    return this.repository.findAll();
  }

  async deleteById(id: number): Promise<void> {
    await this.findById(id);

    await this.repository.deleteById(id);
  }

  async findByEmail(email: string): Promise<UserEntity | null> {
    return this.repository.findByEmail(email);
  }
}
