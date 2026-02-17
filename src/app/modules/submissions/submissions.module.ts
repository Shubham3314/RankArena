import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Contest } from '../../entities/contest/contest.entity';
import { ContestParticipant } from '../../entities/contest-participant/contest-participant.entity';
import { Answer } from '../../entities/answer/answer.entity';
import { Question } from '../../entities/question/question.entity';
import { Option } from '../../entities/option/option.entity';
import { SubmissionsController } from './controller/submissions.controller';
import { SubmissionsService } from './service/submissions.service';
import { JwtService } from '@nestjs/jwt';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Contest,
      ContestParticipant,
      Answer,
      Question,
      Option,
    ]),

  ],
  controllers: [SubmissionsController],
  providers: [SubmissionsService,JwtService],
  exports: [SubmissionsService],
})
export class SubmissionsModule {}
