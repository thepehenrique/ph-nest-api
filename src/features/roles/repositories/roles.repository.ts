import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { RoleEntity } from '../entities/role.entity';

@Injectable()
export class RolesRepository {
  constructor(
    @InjectRepository(RoleEntity)
    private readonly repository: Repository<RoleEntity>,
  ) {}

  async save(user: RoleEntity): Promise<RoleEntity> {
    return this.repository.save(user);
  }

  async findById(id: number): Promise<RoleEntity | null> {
    return this.repository
      .createQueryBuilder('role')
      .where('role.id = :id', { id })
      .getOne();
  }

  async findByName(name: string): Promise<RoleEntity | null> {
    return this.repository
      .createQueryBuilder('role')
      .where('role.name = :name', { name })
      .getOne();
  }
}
