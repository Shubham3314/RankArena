import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Contest } from '../../../entities/contest/contest.entity';
import { ContestParticipant, ParticipantStatus } from '../../../entities/contest-participant/contest-participant.entity';
import { PrizeAward } from '../../../entities/prize-award/prize-award.entity';
import { LeaderboardEntry } from '../../../entities/leaderboard-entry/leaderboard-entry.entity';
import { SubmissionsService } from '../../submissions/service/submissions.service';

@Injectable()
export class ComputeWinnerService {
  constructor(
    @InjectRepository(Contest)
    private readonly contestRepo: Repository<Contest>,
    @InjectRepository(ContestParticipant)
    private readonly participantRepo: Repository<ContestParticipant>,
    @InjectRepository(PrizeAward)
    private readonly prizeAwardRepo: Repository<PrizeAward>,
    @InjectRepository(LeaderboardEntry)
    private readonly leaderboardRepo: Repository<LeaderboardEntry>,
  ) {}

  async computeWinners(contestId: number): Promise<{ winners: PrizeAward[]; leaderboard: LeaderboardEntry[] }> {
    const contest = await this.contestRepo.findOne({ where: { id: contestId } });
    if (!contest) {
      throw new NotFoundException('Contest not found');
    }
    if (contest.awardsComputedAt) {
      const awards = await this.prizeAwardRepo.find({
        where: { contestId },
        relations: ['user'],
      });
      const entries = await this.leaderboardRepo.find({
        where: { contestId },
        relations: ['user'],
        order: { rank: 'ASC' },
      });
      return { winners: awards, leaderboard: entries };
    }
    const participants = await this.participantRepo.find({
      where: { contestId, status: ParticipantStatus.SUBMITTED },
      relations: ['user'],
      order: { score: 'DESC', submittedAt: 'ASC' },
    });
    const awards: PrizeAward[] = [];
    const entries: LeaderboardEntry[] = [];
    let rank = 1;
    for (const p of participants) {
      const award = this.prizeAwardRepo.create({
        contestId,
        userId: p.userId,
        prizeDetails: contest.prizeDescription ?? `Rank #${rank}`,
      });
      const savedAward = await this.prizeAwardRepo.save(award);
      awards.push(savedAward);
      const entry = this.leaderboardRepo.create({
        contestId,
        userId: p.userId,
        score: p.score,
        rank: rank++,
      });
      const savedEntry = await this.leaderboardRepo.save(entry);
      entries.push(savedEntry);
    }
    contest.awardsComputedAt = new Date();
    await this.contestRepo.save(contest);
    return {
      winners: await this.prizeAwardRepo.find({
        where: { contestId },
        relations: ['user'],
      }),
      leaderboard: await this.leaderboardRepo.find({
        where: { contestId },
        relations: ['user'],
        order: { rank: 'ASC' },
      }),
    };
  }
}
