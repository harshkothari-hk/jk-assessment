import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Users } from '../user/user.entity';

@Entity({ name: 'documents' })
export class Documents {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Users, { nullable: false, onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user' })
  user: string | Users;

  @Column({ name: 'key' })
  key: string;

  @Column({ name: 'documentName' })
  documentName: string;

  @Column({
    name: 'isDeleted',
    type: 'boolean',
    default: false,
  })
  isDeleted: boolean;

  @CreateDateColumn({ name: 'createdAt' })
  createdAt: Date;
}
