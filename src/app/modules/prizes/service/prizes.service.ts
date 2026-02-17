import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PrizeAward } from '../../../entities/prize-award/prize-award.entity';

@Injectable()
export class PrizesService {
  constructor(
    @InjectRepository(PrizeAward)
    private readonly prizeAwardRepo: Repository<PrizeAward>,
  ) {}

  async getWinners(contestId: number) {
    const awards = await this.prizeAwardRepo.find({
      where: { contestId },
      relations: ['user'],
      order: { awardedAt: 'DESC' },
    });
    return awards;
  }
}
