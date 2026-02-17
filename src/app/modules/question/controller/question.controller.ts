import {
  Controller,
  Post,
  Patch,
  Param,
  Body,
  UseGuards,
} from '@nestjs/common';
import { QuestionService } from '../service/question.service';
import { UserGuard } from '../../../../common/guards/user.guard';
import { RoleGuard } from '../../../../common/guards/role.guard';
import { Roles } from '../../../../common/decorator/roles.decorator';
import { Role } from '../../../entities/user/user.entity';
import { CreateQuestionDto } from '../dto/create-question.dto';
import { UpdateQuestionDto } from '../dto/update-question.dto';

@Controller()
export class QuestionController {
  constructor(private readonly questionService: QuestionService) {}

  @Post('contests/:id/questions')
  @UseGuards(UserGuard, RoleGuard)
  @Roles(Role.ADMIN)
  async create(
    @Param('id') contestId: string,
    @Body() dto: CreateQuestionDto,
  ) {
    return this.questionService.create(Number(contestId), dto);
  }

  @Patch('questions/:id')
  @UseGuards(UserGuard, RoleGuard)
  @Roles(Role.ADMIN)
  async update(
    @Param('id') id: string,
    @Body() dto: UpdateQuestionDto,
  ) {
    return this.questionService.update(Number(id), dto);
  }
}
