import { Injectable, NotFoundException } from '@nestjs/common';

import { RoleEntity } from './entities/role.entity';
import { RolesRepository } from './repositories/roles.repository';

@Injectable()
export class RolesService {
  constructor(private readonly repository: RolesRepository) {}

  async findById(id: number): Promise<RoleEntity> {
    const role = await this.repository.findById(id);

    if (!role) {
      throw new NotFoundException('Perfil não encontrado.');
    }

    return role;
  }

  async findByName(name: string): Promise<RoleEntity> {
    const role = await this.repository.findByName(name);

    if (!role) {
      throw new NotFoundException('Perfil não encontrado.');
    }

    return role;
  }
}
