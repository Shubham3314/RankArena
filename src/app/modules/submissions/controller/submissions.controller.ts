import {
  Controller,
  Get,
  Post,
  Param,
  Body,
  UseGuards,
  Request,
} from '@nestjs/common';
import { SubmissionsService } from '../service/submissions.service';
import { UserGuard } from '../../../../common/guards/user.guard';
import { ContestAccessGuard } from '../../../../common/guards/contest-access.guard';
import { SaveAnswerDto } from '../dto/save-answer.dto';

@Controller('contests')
export class SubmissionsController {
  constructor(private readonly submissionsService: SubmissionsService) {}

  @Post(':id/answers')
  @UseGuards(UserGuard, ContestAccessGuard)
  async saveAnswer(
    @Param('id') id: string,
    @Body() dto: SaveAnswerDto,
    @Request() req: { user: any },
  ) {
    const optionIds = Array.isArray(dto.optionIds) ? dto.optionIds : [dto.optionIds];
    return this.submissionsService.saveAnswer(
      Number(id),
      req.user.id,
      dto.questionId,
      optionIds,
    );
  }

  @Post(':id/submit')
  @UseGuards(UserGuard, ContestAccessGuard)
  async submit(
    @Param('id') id: string,
    @Request() req: { user: any },
  ) {
    return this.submissionsService.submit(Number(id), req.user.id);
  }

  @Get(':id/answers/me')
  @UseGuards(UserGuard, ContestAccessGuard)
  async getMyAnswers(
    @Param('id') id: string,
    @Request() req: { user: any },
  ) {
    return this.submissionsService.getMyAnswers(Number(id), req.user.id);
  }
}
