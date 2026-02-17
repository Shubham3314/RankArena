import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { User } from '../user/user.entity';

export enum AccessLevel {
  NORMAL = 'normal',
  VIP = 'vip',
}

@Entity()
export class Contest {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({ type: 'text', nullable: true })
  description: string | null;

  @Column({ type: 'enum', enum: AccessLevel, default: AccessLevel.NORMAL })
  accessLevel: AccessLevel;

  @Column({ type: 'datetime' })
  startTime: Date;

  @Column({ type: 'datetime' })
  endTime: Date;

  @Column({ type: 'text', nullable: true })
  prizeDescription: string | null;

  @Column({ type: 'boolean', default: false })
  isPublished: boolean;

  @Column({ type: 'bigint', nullable: true })
  createdBy: number | null;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'created_by' })
  creator: User | null;

  @Column({ type: 'timestamp', nullable: true })
  awardsComputedAt: Date | null;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
