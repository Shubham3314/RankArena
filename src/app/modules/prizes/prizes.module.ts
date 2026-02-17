import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PrizeAward } from '../../entities/prize-award/prize-award.entity';
import { PrizesController } from './controller/prizes.controller';
import { PrizesService } from './service/prizes.service';
import { JwtService } from '@nestjs/jwt';

@Module({
  imports: [TypeOrmModule.forFeature([PrizeAward])],
  controllers: [PrizesController],
  providers: [PrizesService,JwtService],
  exports: [PrizesService],
})
export class PrizesModule {}
