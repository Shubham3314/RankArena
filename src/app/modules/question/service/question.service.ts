import {
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Question, QuestionType } from '../../../entities/question/question.entity';
import { Option } from '../../../entities/option/option.entity';
import { CreateQuestionDto } from '../dto/create-question.dto';
import { UpdateQuestionDto } from '../dto/update-question.dto';

@Injectable()
export class QuestionService {
  constructor(
    @InjectRepository(Question)
    private readonly questionRepo: Repository<Question>,
    @InjectRepository(Option)
    private readonly optionRepo: Repository<Option>,
  ) {}

  async create(
    contestId: number,
    dto: CreateQuestionDto,
  ): Promise<Question> {
    const question = this.questionRepo.create({
      ...dto,
      contestId,
    });
    const saved = await this.questionRepo.save(question);
    if (dto.options?.length) {
      for (let i = 0; i < dto.options.length; i++) {
        const opt = this.optionRepo.create({
          ...dto.options[i],
          questionId: saved.id,
          orderIndex: i,
        });
        await this.optionRepo.save(opt);
      }
    }
    return this.questionRepo.findOne({
      where: { id: saved.id },
      relations: ['options'],
    }) as Promise<Question>;
  }

  async update(id: number, dto: UpdateQuestionDto): Promise<Question> {
    const question = await this.questionRepo.findOne({ where: { id } });
    if (!question) {
      throw new NotFoundException('Question not found');
    }
    Object.assign(question, dto);
    return this.questionRepo.save(question);
  }

  async findByContest(contestId: number): Promise<Question[]> {
    return this.questionRepo.find({
      where: { contestId },
      relations: ['options'],
      order: { orderIndex: 'ASC' },
    });
  }
}
