import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { RoleEntity } from './entities/role.entity';
import { RolesRepository } from './repositories/roles.repository';
import { RolesService } from './roles.service';

@Module({
  imports: [TypeOrmModule.forFeature([RoleEntity])],
  providers: [RolesRepository, RolesService],
  exports: [RolesService],
})
export class RolesModule {}
