import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Roles } from '../roles/role.entity';

@Entity({ name: 'users' })
export class Users {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'firstName' })
  firstName: string;

  @Column({ name: 'lastName' })
  lastName: string;

  @Column({ name: 'email' })
  email: string;

  @Column({ name: 'contactNumber' })
  contactNumber: string;

  @Column({ name: 'password' })
  password: string;

  @Column({
    name: 'isDeleted',
    type: 'boolean', 
    default: false,
  })
  isDeleted: boolean;

  @ManyToOne(() => Roles, { nullable: false, onDelete: 'CASCADE' })
  @JoinColumn({ name: 'role' })
  role: string | Roles;

  @CreateDateColumn({ name: 'createdAt' })
  createdAt: Date;
}
