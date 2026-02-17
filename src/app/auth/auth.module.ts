import { Module } from '@nestjs/common';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthController } from './controller/auth.controller';
import { AuthService } from './service/auth.service';
import { JwtStrategy } from './strategy/jwt-strategy';
import { ClientLocalStrategy } from './strategy/local-strategy';
import { CustomLocalGuard } from './guard/custom-local.guard';
import { UserModule } from '../modules/user/user.module';
import { RefreshToken } from '../entities/refresh-token/refresh-token.entity';

@Module({
  imports: [
    PassportModule.register({ session: false }),
    JwtModule.register({
      secret: process.env.JWT_SECRET,
      signOptions: {
        expiresIn: (process.env.JWT_EXPIRES_IN ?? '1h') as any,
      },
    }),
    TypeOrmModule.forFeature([RefreshToken]),
    UserModule,
  ],
  providers: [
    AuthService,
    ClientLocalStrategy,
    JwtStrategy,
    JwtService,
    CustomLocalGuard,
  ],
  controllers: [AuthController],
  exports: [JwtService, AuthService],
})
export class AuthModule {}
