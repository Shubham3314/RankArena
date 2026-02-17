import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  Unique,
} from 'typeorm';
import { Contest } from '../contest/contest.entity';
import { User } from '../user/user.entity';

@Entity()
@Unique(['contestId', 'userId'])
export class PrizeAward {
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
  awardedAt: Date;

  @Column({ type: 'text', nullable: true })
  prizeDetails: string | null;
}
