import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Question } from '../question/question.entity';

@Entity()
export class Option {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  questionId: number;

  @ManyToOne(() => Question, (q) => q.options, { onDelete: 'CASCADE' })
  @JoinColumn()
  question: Question;

  @Column({ type: 'varchar', length: 1000 })
  text: string;

  @Column({ type: 'boolean', default: false })
  isCorrect: boolean;

  @Column({ type: 'int', default: 0 })
  orderIndex: number;
}
