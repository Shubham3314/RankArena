import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';

import { User } from './app/entities/user/user.entity';
import { RefreshToken } from './app/entities/refresh-token/refresh-token.entity';
import { Contest } from './app/entities/contest/contest.entity';
import { Question } from './app/entities/question/question.entity';
import { Option } from './app/entities/option/option.entity';
import { ContestParticipant } from './app/entities/contest-participant/contest-participant.entity';
import { Answer } from './app/entities/answer/answer.entity';
import { PrizeAward } from './app/entities/prize-award/prize-award.entity';
import { LeaderboardEntry } from './app/entities/leaderboard-entry/leaderboard-entry.entity';
import { UserModule } from './app/modules/user/user.module';
import { AuthModule } from './app/auth/auth.module';
import { ContestModule } from './app/modules/contest/contest.module';
import { QuestionModule } from './app/modules/question/question.module';
import { SubmissionsModule } from './app/modules/submissions/submissions.module';
import { PrizesModule } from './app/modules/prizes/prizes.module';
import { CommonModule } from './common/common.module';
import { SnakeNamingStrategy } from 'typeorm-naming-strategies';
import { ThrottlerModule } from '@nestjs/throttler';

const entities = [
  User,
  RefreshToken,
  Contest,
  Question,
  Option,
  ContestParticipant,
  Answer,
  PrizeAward,
  LeaderboardEntry,
];

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: process.env.DB_HOST ?? 'localhost',
      port: parseInt(process.env.DB_PORT ?? '3306', 10),
      username: process.env.DB_USERNAME ?? 'root',
      password: process.env.DB_PASSWORD ?? '',
      database: process.env.DB_NAME ?? 'rank_arena',
      namingStrategy:  new SnakeNamingStrategy()  ,
      entities,
      synchronize: process.env.NODE_ENV !== 'production',
    }),
    ThrottlerModule.forRoot([
      {
        name: 'short',
        ttl: 100000,
        limit: 3,
      },
      {
        name: 'medium',
        ttl: 1000000,
        limit: 20
      },
      {
        name: 'long',
        ttl: 6000000,
        limit: 100
      }
    ]),
    CommonModule,
    UserModule,
    AuthModule,
    ContestModule,
    QuestionModule,
    SubmissionsModule,
    PrizesModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
