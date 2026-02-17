import { IsEnum } from 'class-validator';
import { Role } from '../../../entities/user/user.entity';

export class UpdateRoleDto {
  @IsEnum(Role)
  role: Role;
}
