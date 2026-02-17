import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  OneToMany,
  Unique,
} from 'typeorm';
import { Contest } from '../contest/contest.entity';
import { User } from '../user/user.entity';
import { Answer } from '../answer/answer.entity';

export enum ParticipantStatus {
  IN_PROGRESS = 'in_progress',
  SUBMITTED = 'submitted',
}

@Entity()
@Unique(['contestId', 'userId'])
export class ContestParticipant {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  contestId: number;

  @ManyToOne(() => Contest, { onDelete: 'CASCADE' })
  @JoinColumn()
  contest: Contest;

  @Column()
  userId: number;

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn()
  user: User;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  joinedAt: Date;

  @Column({ type: 'timestamp', nullable: true })
  submittedAt: Date | null;

  @Column({ type: 'enum', enum: ParticipantStatus, default: ParticipantStatus.IN_PROGRESS })
  status: ParticipantStatus;

  @Column({ type: 'int', default: 0 })
  score: number;

  @OneToMany(() => Answer, (a) => a.participant)
  answers: Answer[];
}
