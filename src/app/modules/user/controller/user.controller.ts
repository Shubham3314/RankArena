import { Controller, Get, UseGuards } from '@nestjs/common';
import { UserService } from '../service/user.service';
import { UserGuard } from 'src/common/guards/user.guard';
import { User } from 'src/app/entities/user/user.entity';
import { CurrentUser } from 'src/common/decorator/user.decorator';


@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('me')
  @UseGuards(UserGuard)
  async getUser(@CurrentUser() user: User) {
    return await this.userService.getUserByEmail(user.email)
  }
}
