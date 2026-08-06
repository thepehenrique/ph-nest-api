import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DeleteResult } from 'typeorm';
import { UserEntity } from '../entities/users.entity';

@Injectable()
export class UsersRepository {
  constructor(
    @InjectRepository(UserEntity)
    private readonly repository: Repository<UserEntity>,
  ) {}

  async save(user: UserEntity): Promise<UserEntity> {
    return this.repository.save(user);
  }

  async findById(id: number): Promise<UserEntity | null> {
    return this.repository
      .createQueryBuilder('user')
      .where('user.id = :id', { id })
      .getOne();
  }

  async findByEmail(email: string): Promise<UserEntity | null> {
    return this.repository
      .createQueryBuilder('user')
      .leftJoinAndSelect('user.role', 'role')
      .where('user.email = :email', { email })
      .getOne();
  }

  async deleteById(id: number): Promise<DeleteResult> {
    return this.repository.delete(id);
  }
}
