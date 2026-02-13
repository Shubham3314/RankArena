import { Body, Controller, Post } from '@nestjs/common';
import { UserService } from '../service/user.service';
import { User } from 'src/app/entities/user/user.entity';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  // @Post('create')
  // async createUser(@Body() user: CreateUserDto): Promise<User> {
  //   return this.userService.createUser(user);
  // }
}
