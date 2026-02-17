import {
  Injectable,
  NotFoundException,
  BadRequestException,
  ForbiddenException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Contest } from '../../../entities/contest/contest.entity';
import { ContestParticipant, ParticipantStatus } from '../../../entities/contest-participant/contest-participant.entity';
import { Answer } from '../../../entities/answer/answer.entity';
import { Question, QuestionType } from '../../../entities/question/question.entity';
import { Option } from '../../../entities/option/option.entity';

@Injectable()
export class SubmissionsService {
  constructor(
    @InjectRepository(Contest)
    private readonly contestRepo: Repository<Contest>,
    @InjectRepository(ContestParticipant)
    private readonly participantRepo: Repository<ContestParticipant>,
    @InjectRepository(Answer)
    private readonly answerRepo: Repository<Answer>,
    @InjectRepository(Question)
    private readonly questionRepo: Repository<Question>,
    @InjectRepository(Option)
    private readonly optionRepo: Repository<Option>,
  ) {}

  async saveAnswer(
    contestId: number,
    userId: number,
    questionId: number,
    optionIds: number[],
  ): Promise<Answer | Answer[]> {
    const participant = await this.getOrFailParticipant(contestId, userId);
    if (participant.status === ParticipantStatus.SUBMITTED) {
      throw new BadRequestException('Contest already submitted');
    }
    await this.validateContestActive(contestId);
    const question = await this.questionRepo.findOne({
      where: { id: questionId, contestId },
      relations: ['options'],
    });
    if (!question) {
      throw new NotFoundException('Question not found');
    }
    const existing = await this.answerRepo.find({
      where: { participantId: participant.id, questionId },
    });
    if (question.type === QuestionType.SINGLE || question.type === QuestionType.TRUEFALSE) {
      await this.answerRepo.remove(existing);
      const optId = optionIds[0] ?? null;
      if (optId) {
        const opt = question.options.find((o) => o.id === optId);
        if (!opt) {
          throw new BadRequestException('Option not found');
        }
        const ans = this.answerRepo.create({
          participantId: participant.id,
          questionId,
          optionId: optId,
        });
        return this.answerRepo.save(ans);
      }
      return null as any;
    }
    if (question.type === QuestionType.MULTI) {
      await this.answerRepo.remove(existing);
      const results: Answer[] = [];
      for (const optId of optionIds) {
        const opt = question.options.find((o) => o.id === optId);
        if (!opt) continue;
        const ans = this.answerRepo.create({
          participantId: participant.id,
          questionId,
          optionId: optId,
        });
        results.push(await this.answerRepo.save(ans));
      }
      return results;
    }
    return null as any;
  }

  async submit(contestId: number, userId: number): Promise<{ score: number }> {
    const participant = await this.getOrFailParticipant(contestId, userId);
    if (participant.status === ParticipantStatus.SUBMITTED) {
      throw new BadRequestException('Already submitted');
    }
    await this.validateContestActive(contestId);
    const score = await this.computeScore(participant.id);
    participant.score = score;
    participant.status = ParticipantStatus.SUBMITTED;
    participant.submittedAt = new Date();
    await this.participantRepo.save(participant);
    return { score };
  }

  async getMyAnswers(contestId: number, userId: number): Promise<Answer[]> {
    const participant = await this.getOrFailParticipant(contestId, userId);
    return this.answerRepo.find({
      where: { participantId: participant.id },
      relations: ['question', 'option'],
      order: { questionId: 'ASC' },
    });
  }

  async computeScore(participantId: number): Promise<number> {
    const answers = await this.answerRepo.find({
      where: { participantId },
      relations: ['question', 'question.options', 'option'],
    });
    const byQuestion = new Map<number, { question: Question; optionIds: number[]; optionCorrect: Map<number, boolean> }>();
    for (const a of answers) {
      if (!byQuestion.has(a.questionId)) {
        const q = a.question!;
        const optionCorrect = new Map<number, boolean>();
        for (const o of q.options ?? []) {
          optionCorrect.set(o.id, o.isCorrect);
        }
        byQuestion.set(a.questionId, {
          question: q,
          optionIds: [],
          optionCorrect,
        });
      }
      const entry = byQuestion.get(a.questionId)!;
      if (a.optionId) {
        entry.optionIds.push(a.optionId);
      }
    }
    for (const a of answers) {
      const entry = byQuestion.get(a.questionId);
      if (entry && a.optionId && !entry.optionIds.includes(a.optionId)) {
        entry.optionIds.push(a.optionId);
      }
    }
    let total = 0;
    for (const [, entry] of byQuestion) {
      const { question, optionIds, optionCorrect } = entry;
      if (question.type === QuestionType.SINGLE || question.type === QuestionType.TRUEFALSE) {
        const optId = optionIds[0];
        if (optId && optionCorrect.get(optId)) {
          total += question.points;
        }
      } else if (question.type === QuestionType.MULTI) {
        for (const optId of optionIds) {
          if (optionCorrect.get(optId)) {
            total += question.points ?? 1;
          }
        }
      }
    }
    return total;
  }

  private async getOrFailParticipant(
    contestId: number,
    userId: number,
  ): Promise<ContestParticipant> {
    const participant = await this.participantRepo.findOne({
      where: { contestId, userId },
    });
    if (!participant) {
      throw new ForbiddenException('You must join the contest first');
    }
    return participant;
  }

  private async validateContestActive(contestId: number): Promise<void> {
    const contest = await this.contestRepo.findOne({ where: { id: contestId } });
    if (!contest) {
      throw new NotFoundException('Contest not found');
    }
    const now = new Date();
    if (now < contest.startTime) {
      throw new BadRequestException('Contest has not started yet');
    }
    if (now < contest.endTime) {
      throw new BadRequestException('Contest has ended');
    }
  }
}
