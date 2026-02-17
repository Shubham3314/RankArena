import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Contest } from '../contest/contest.entity';
import { User } from '../user/user.entity';

@Entity()
export class LeaderboardEntry {
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

  @Column()
  score: number;

  @Column({ type: 'int', nullable: true })
  rank: number | null;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  computedAt: Date;
}
