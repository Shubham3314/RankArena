import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
  OneToMany,
} from 'typeorm';
import { Contest } from '../contest/contest.entity';
import { Option } from '../option/option.entity';

export enum QuestionType {
  SINGLE = 'single',
  MULTI = 'multi',
  TRUEFALSE = 'truefalse',
}

@Entity()
export class Question {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  contestId: number;

  @ManyToOne(() => Contest, { onDelete: 'CASCADE' })
  @JoinColumn()
  contest: Contest;

  @Column({ type: 'enum', enum: QuestionType })
  type: QuestionType;

  @Column()
  text: string;

  @Column({ default: 1 })
  points: number;

  @Column({ type: 'int', default: 0 })
  orderIndex: number;

  @CreateDateColumn()
  createdAt: Date;

  @OneToMany(() => Option, (opt) => opt.question)
  options: Option[];
}
