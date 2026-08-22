import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { UserEntity } from './entities/users.entity';
import { UsersRepository } from './repositories/users.repository';
import { UsersController } from './users.controller';
import { RolesModule } from '../roles/roles.module';
import { UsersService } from './services/users.service';
import { EmailVerificationService } from 'src/infrastructure/verification/email-verification.service';

@Module({
  imports: [TypeOrmModule.forFeature([UserEntity]), RolesModule],
  controllers: [UsersController],
  providers: [UsersService, EmailVerificationService, UsersRepository],
  exports: [UsersService, UsersRepository, EmailVerificationService],
})
export class UsersModule {}
