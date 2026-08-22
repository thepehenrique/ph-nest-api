import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { ROLES } from 'src/common/constants/roles.constants';
import { RolesService } from 'src/features/roles/roles.service';
import { EmailQueue } from 'src/infrastructure/queue/email.queue';
import { CreateUserDto } from '../dto/create-user.dto';
import { UserResponseDto } from '../dto/user-response.dto';
import { UserEntity } from '../entities/users.entity';
import { UsersRepository } from '../repositories/users.repository';
import { EmailVerificationService } from 'src/infrastructure/verification/email-verification.service';

@Injectable()
export class UsersService {
  constructor(
    private readonly repository: UsersRepository,
    private readonly rolesService: RolesService,
    private readonly emailQueue: EmailQueue,
    private readonly emailVerificationService: EmailVerificationService,
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

    const code = this.emailVerificationService.generateCode();

    await this.emailVerificationService.saveCode(user.id, code);

    await this.emailQueue.addVerificationEmail(user.id, bodyDto.email, code);

    return user.id;
  }

  async update(user: UserEntity): Promise<void> {
    await this.repository.save(user);
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
