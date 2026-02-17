import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { ContestParticipant } from '../contest-participant/contest-participant.entity';
import { Question } from '../question/question.entity';
import { Option } from '../option/option.entity';

@Entity()
export class Answer {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  participantId: number;

  @ManyToOne(() => ContestParticipant, (p) => p.answers, { onDelete: 'CASCADE' })
  @JoinColumn()
  participant: ContestParticipant;

  @Column()
  questionId: number;

  @ManyToOne(() => Question, { onDelete: 'CASCADE' })
  @JoinColumn()
  question: Question;

  @Column({ nullable: true })
  optionId: number | null;

  @ManyToOne(() => Option, { onDelete: 'CASCADE' })
  @JoinColumn()
  option: Option | null;

  @CreateDateColumn()
  createdAt: Date;
}
