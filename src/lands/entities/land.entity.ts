import { User } from 'src/users/entities/user.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn
} from 'typeorm';
import { AttachFiles } from './attachFiles.entity';

@Entity()
export class Land {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User, (user) => user.id)
  user: User;

  @OneToMany(() => AttachFiles, (files) => files.land, {
    eager: true,
  })
  @JoinColumn()
  attachFiles: AttachFiles[];

  @Column({ nullable: true })
  location: string;

  @Column()
  city: string;

  @Column()
  province: string;

  @Column()
  owner: string;

  @Column({ default: false })
  requestOwner: string;

  @Column({ nullable: true })
  status: string;

  @Column({ nullable: true })
  area: string;

  @Column({ nullable: true })
  type: string;

  @Column({ nullable: true })
  contractorUnitCommitted: string;

  @CreateDateColumn({ type: 'timestamptz' })
  createdAt: Date;

  @CreateDateColumn({ type: 'timestamptz' })
  updatedAt: Date;
}
