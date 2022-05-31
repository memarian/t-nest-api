import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn
} from 'typeorm';
import { Land } from './land.entity';

@Entity()
export class AttachFiles {
  @PrimaryGeneratedColumn()
  id?: number;

  @Column()
  fileName: string;

  @Column()
  originalName: string;

  @Column()
  fieldName: string;

  @ManyToOne(() => Land, (land) => land.attachFiles, {
    eager: false,
    onDelete: 'CASCADE',
  })
  @JoinColumn()
  land: Land;

  @CreateDateColumn({ type: 'timestamptz' })
  createdAt: Date;

  @CreateDateColumn({ type: 'timestamptz' })
  updatedAt: Date;
}
