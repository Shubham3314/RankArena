import {
  Controller,
  Get,
  Patch,
  Param,
  Body,
  UseGuards,
} from '@nestjs/common';
import { UserService } from '../service/user.service';
import { UserGuard } from '../../../../common/guards/user.guard';
import { RoleGuard } from '../../../../common/guards/role.guard';
import { CurrentUser } from '../../../../common/decorator/user.decorator';
import { User } from '../../../entities/user/user.entity';
import { Roles } from '../../../../common/decorator/roles.decorator';
import { Role } from '../../../entities/user/user.entity';
import { UpdateRoleDto } from '../dto/update-role.dto';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('me')
  @UseGuards(UserGuard)
  async getMe(@CurrentUser() user: User) {
    return this.userService.getUserByEmail(user.email);
  }

  @Patch(':id/role')
  @UseGuards(UserGuard, RoleGuard)
  @Roles(Role.ADMIN)
  async updateRole(
    @Param('id') id: string,
    @Body() dto: UpdateRoleDto,
  ) {
    return this.userService.updateRole(Number(id), dto.role);
  }
}
