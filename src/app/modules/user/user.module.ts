import { Global, Module } from '@nestjs/common';
import { UserService } from './service/user.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/app/entities/user/user.entity';
import { UserRepository } from './respository/user.repository';
import { UserController } from './controller/user.controller';
import { JwtService } from '@nestjs/jwt';

@Global()
@Module({
  imports: [TypeOrmModule.forFeature([User]),],
  controllers: [UserController],
  providers: [UserRepository, UserService,JwtService],
  exports: [UserService],
})
export class UserModule {}
