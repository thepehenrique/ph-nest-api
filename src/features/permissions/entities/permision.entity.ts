import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

import { RolePermissionEntity } from '../../roles/entities/role-permission.entity';

@Entity({
  name: 'permissions',
})
export class PermissionEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    name: 'code',
    type: 'varchar',
    length: 100,
    unique: true,
  })
  code: string;

  @Column({
    name: 'description',
    type: 'varchar',
    length: 255,
    nullable: true,
  })
  description?: string;

  @CreateDateColumn({
    name: 'created_at',
  })
  createdAt: Date;

  @OneToMany(
    () => RolePermissionEntity,
    (rolePermission) => rolePermission.permission,
  )
  rolePermissions: RolePermissionEntity[];
}
