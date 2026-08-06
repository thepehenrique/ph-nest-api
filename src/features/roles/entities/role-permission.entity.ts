import { PermissionEntity } from 'src/features/permissions/entities/permision.entity';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  JoinColumn,
  ManyToOne,
} from 'typeorm';
import { RoleEntity } from './role.entity';

@Entity({
  name: 'role_permissions',
})
export class RolePermissionEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    name: 'role_id',
  })
  roleId: number;

  @Column({
    name: 'permission_id',
  })
  permissionId: number;

  @ManyToOne(() => RoleEntity, (role) => role.rolePermissions)
  @JoinColumn({
    name: 'role_id',
  })
  role: RoleEntity;

  @ManyToOne(() => PermissionEntity, (permission) => permission.rolePermissions)
  @JoinColumn({
    name: 'permission_id',
  })
  permission: PermissionEntity;
}
