import {
  Injectable,
  NotFoundException,
  ConflictException,
  Optional,
  Inject,
  forwardRef,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Contest } from '../../../entities/contest/contest.entity';
import { ContestParticipant, ParticipantStatus } from '../../../entities/contest-participant/contest-participant.entity';
import { LeaderboardEntry } from '../../../entities/leaderboard-entry/leaderboard-entry.entity';
import { CreateContestDto } from '../dto/create-contest.dto';
import { UpdateContestDto } from '../dto/update-contest.dto';

@Injectable()
export class ContestService {
  constructor(
    @InjectRepository(Contest)
    private readonly contestRepo: Repository<Contest>,
    @InjectRepository(ContestParticipant)
    private readonly participantRepo: Repository<ContestParticipant>,
    @InjectRepository(LeaderboardEntry)
    private readonly leaderboardRepo: Repository<LeaderboardEntry>,
  ) {}

  async create(dto: CreateContestDto, createdBy: number): Promise<Contest> {
    const contest = this.contestRepo.create({
      ...dto,
      startTime: new Date(dto.startTime),
      endTime: new Date(dto.endTime),
      createdBy,
    });
    const saved = await this.contestRepo.save(contest);
    // create a job to end contest 
    return saved;
  }

  async update(id: number, dto: UpdateContestDto): Promise<Contest> {
    const contest = await this.findOne(id);
    Object.assign(contest, dto);
    return this.contestRepo.save(contest);
  }

  async findAll(): Promise<Contest[]> {
    return this.contestRepo
      .createQueryBuilder('c')
      .orderBy('c.start_time', 'DESC')
      .getMany();
  }

  async findOne(id: number): Promise<Contest> {
    const contest = await this.contestRepo.findOne({
      where: { id }
    });
    if (!contest) {
      throw new NotFoundException('Contest not found');
    }
    return contest;
  }

  async join(contestId: number, userId: number): Promise<ContestParticipant> {
    await this.findOne(contestId);
    const existing = await this.participantRepo.findOne({
      where: { contestId, userId },
    });
    if (existing) {
      throw new ConflictException('Already joined this contest');
    }
    const participant = this.participantRepo.create({ contestId, userId });
    return this.participantRepo.save(participant);
  }

  async getLeaderboard(
    contestId: number,
    limit: number,
    offset: number,
  ): Promise<{ entries: any[]; total: number }> {
    const entries = await this.leaderboardRepo.find({
      where: { contestId },
      relations: ['user'],
      order: { rank: 'ASC' },
      take: limit,
      skip: offset,
    });
    const total = await this.leaderboardRepo.count({ where: { contestId } });
    if (total > 0) {
      return {
        entries: entries.map((e) => ({
          rank: e.rank,
          score: e.score,
          user: e.user,
        })),
        total,
      };
    }
    const participants = await this.participantRepo.find({
      where: { contestId, status: ParticipantStatus.SUBMITTED },
      relations: ['user'],
      order: { score: 'DESC', submittedAt: 'ASC' },
      take: limit,
      skip: offset,
    });
    const pTotal = await this.participantRepo.count({
      where: { contestId, status: ParticipantStatus.SUBMITTED },
    });
    return {
      entries: participants.map((p, i) => ({
        rank: offset + i + 1,
        score: p.score,
        user: p.user,
      })),
      total: pTotal,
    };
  }
}
