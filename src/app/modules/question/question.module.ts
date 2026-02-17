import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Question } from '../../entities/question/question.entity';
import { Option } from '../../entities/option/option.entity';
import { QuestionController } from './controller/question.controller';
import { QuestionService } from './service/question.service';
import { JwtService } from '@nestjs/jwt';

@Module({
  imports: [
    TypeOrmModule.forFeature([Question, Option]),
  ],
  controllers: [QuestionController],
  providers: [QuestionService,JwtService],
  exports: [QuestionService],
})
export class QuestionModule {}
