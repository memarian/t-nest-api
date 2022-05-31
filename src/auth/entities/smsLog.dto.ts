import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn
} from 'typeorm';

@Entity()
export class SmsLog {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  message: string;

  @Column()
  isSuccess: boolean;

  @CreateDateColumn({ type: 'timestamptz' })
  createdAt: Date;
}
