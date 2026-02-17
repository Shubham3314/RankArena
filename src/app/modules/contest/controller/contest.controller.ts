import {
  Controller,
  Get,
  Post,
  Patch,
  Param,
  Body,
  Query,
  UseGuards,
  Request,
} from '@nestjs/common';
import { ContestService } from '../service/contest.service';
import { ComputeWinnerService } from '../service/compute-winner.service';
import { UserGuard } from '../../../../common/guards/user.guard';
import { RoleGuard } from '../../../../common/guards/role.guard';
import { ContestAccessGuard } from '../../../../common/guards/contest-access.guard';
import { Roles } from '../../../../common/decorator/roles.decorator';
import { Role, User } from '../../../entities/user/user.entity';
import { CreateContestDto } from '../dto/create-contest.dto';
import { UpdateContestDto } from '../dto/update-contest.dto';
import { CurrentUser } from 'src/common/decorator/user.decorator';

@Controller('contests')
export class ContestController {
  constructor(
    private readonly contestService: ContestService,
    private readonly computeWinnerService: ComputeWinnerService,
  ) {}

  @Post()
  @UseGuards(UserGuard, RoleGuard)
  @Roles(Role.ADMIN)
  async create(@Body() dto: CreateContestDto, @Request() req: { user: any }) {
    return this.contestService.create(dto, req.user.id);
  }

  @Patch(':id')
  @UseGuards(UserGuard, RoleGuard)
  @Roles(Role.ADMIN)
  async update(
    @Param('id') id: string,
    @Body() dto: UpdateContestDto,
  ) {
    return this.contestService.update(Number(id), dto);
  }

  @Get()
  async findAll() {
    return this.contestService.findAll();
  }

  @Get(':id')
  @UseGuards(UserGuard)
  async findOne(@Param('id') id: string) {
    return this.contestService.findOne(Number(id));
  }

  @Post(':id/join')
  @UseGuards(UserGuard, ContestAccessGuard)
  async join(@Param('id') id: string, @CurrentUser() user: User) {
    return this.contestService.join(Number(id), user.id);
  }

  @Post(':id/compute-winner')
  @UseGuards(UserGuard, RoleGuard)
  @Roles(Role.ADMIN)
  async computeWinner(@Param('id') id: string) {
    return this.computeWinnerService.computeWinners(Number(id));
  }

  @Get(':id/leaderboard')
  @UseGuards(UserGuard)
  async getLeaderboard(
    @Param('id') id: string,
    @Query('limit') limitStr?: string,
    @Query('offset') offsetStr?: string,
  ) {
    const limit = limitStr ? parseInt(limitStr, 10) : 20;
    const offset = offsetStr ? parseInt(offsetStr, 10) : 0;
    return this.contestService.getLeaderboard(Number(id), limit, offset);
  }
}
