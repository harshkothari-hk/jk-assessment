import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Roles } from '../roles/role.entity';

@Entity({ name: 'role-permission' })
export class RolePermission {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'canRead', type: 'boolean' })
  canRead: boolean;

  @Column({ name: 'canWrite', type: 'boolean' })
  canWrite: boolean;

  @Column({ name: 'canUpdate', type: 'boolean' })
  canUpdate: boolean;

  @Column({ name: 'canDelete', type: 'boolean' })
  canDelete: boolean;

  @Column({ name: 'serviceType' })
  serviceType: string;

  @ManyToOne(() => Roles, { nullable: false, onDelete: 'CASCADE' })
  @JoinColumn({ name: 'roleId' })
  role: Roles | string;

  @Column({ name: 'roleId' })
  roleId: string;
}
