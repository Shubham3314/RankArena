import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Contest } from '../../entities/contest/contest.entity';
import { ContestParticipant } from '../../entities/contest-participant/contest-participant.entity';
import { LeaderboardEntry } from '../../entities/leaderboard-entry/leaderboard-entry.entity';
import { ContestController } from './controller/contest.controller';
import { ContestService } from './service/contest.service';
import { JwtService } from '@nestjs/jwt';
import { ComputeWinnerService } from './service/compute-winner.service';
import { PrizeAward } from 'src/app/entities/prize-award/prize-award.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Contest,
      ContestParticipant,
      LeaderboardEntry,
      PrizeAward
    ]),
  ],
  controllers: [ContestController],
  providers: [ContestService,JwtService,ComputeWinnerService],
  exports: [ContestService],
})
export class ContestModule {}
