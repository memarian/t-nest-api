import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn
} from 'typeorm';

@Entity()
export class LoginUser {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'numeric', unique: true })
  phone: string;

  @CreateDateColumn({ type: 'timestamptz' })
  createdAt: Date;

  @CreateDateColumn({ type: 'timestamptz' })
  updatedAt: Date;

  @Column({ unique: true })
  code: number;

  @Column({ default: 0 })
  total: number;

  @Column({ unique: true })
  token: string;
}
