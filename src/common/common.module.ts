import { Global, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Contest } from '../app/entities/contest/contest.entity';
import { RoleGuard } from './guards/role.guard';
import { ContestAccessGuard } from './guards/contest-access.guard';

@Global()
@Module({
  imports: [TypeOrmModule.forFeature([Contest])],
  providers: [RoleGuard, ContestAccessGuard],
  exports: [RoleGuard, ContestAccessGuard],
})
export class CommonModule {}
