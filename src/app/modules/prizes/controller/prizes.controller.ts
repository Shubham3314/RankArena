import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import { PrizesService } from '../service/prizes.service';
import { UserGuard } from '../../../../common/guards/user.guard';

@Controller('contests')
export class PrizesController {
  constructor(private readonly prizesService: PrizesService) {}

  @Get(':id/winners')
  @UseGuards(UserGuard)
  async getWinners(@Param('id') id: string) {
    return this.prizesService.getWinners(Number(id));
  }
}
