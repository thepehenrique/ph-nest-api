import { UserEntity } from 'src/features/users/entities/users.entity';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm';
import { RolePermissionEntity } from './role-permission.entity';

@Entity({
  name: 'roles',
})
export class RoleEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    name: 'name',
    length: 100,
    unique: true,
  })
  name: string;

  @Column({
    name: 'description',
    length: 255,
    nullable: true,
  })
  description?: string;

  @Column({
    name: 'is_active',
    default: true,
  })
  isActive: boolean;

  @CreateDateColumn({
    name: 'created_at',
  })
  createdAt: Date;

  @UpdateDateColumn({
    name: 'updated_at',
  })
  updatedAt: Date;

  @OneToMany(() => UserEntity, (user) => user.role)
  users: UserEntity[];

  @OneToMany(
    () => RolePermissionEntity,
    (rolePermission) => rolePermission.role,
  )
  rolePermissions: RolePermissionEntity[];
}
