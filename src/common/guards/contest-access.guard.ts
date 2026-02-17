import {
  CanActivate,
  ExecutionContext,
  Injectable,
  ForbiddenException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Role } from '../../app/entities/user/user.entity';
import { AccessLevel, Contest } from '../../app/entities/contest/contest.entity';

@Injectable()
export class ContestAccessGuard implements CanActivate {
  constructor(
    @InjectRepository(Contest)
    private readonly contestRepo: Repository<Contest>,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const user = request.user;
    const contestId = request.params?.id ?? request.params?.contestId;

    if (!contestId || !user) {
      return true;
    }

    const contest = await this.contestRepo.findOne({
      where: { id: Number(contestId) },
    });
    if (!contest) {
      return true;
    }

    if (user.role === Role.ADMIN) {
      return true;
    }

    if (contest.accessLevel === AccessLevel.VIP && user.role !== Role.VIP) {
      throw new ForbiddenException('This contest requires VIP access');
    }

    return true;
  }
}
