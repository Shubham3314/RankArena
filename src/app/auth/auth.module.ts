import { Module } from '@nestjs/common';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { AuthController } from './controller/auth.controller';
import { AuthService } from './service/auth.service';
import { JwtStrategy } from './strategy/jwt-strategy';
import { ClientLocalStrategy } from './strategy/local-strategy';
import { CustomLocalGuard } from './guard/custom-local.guard';
import { UserModule } from '../modules/user/user.module';

@Module({
  imports: [
    PassportModule.register({ session: true }),
    JwtModule.register({
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: '1h' },
    }),
    UserModule,
  ],
  providers: [AuthService, ClientLocalStrategy, JwtStrategy, JwtService, CustomLocalGuard],
  controllers: [AuthController],
  exports: [JwtService, AuthService],
})
export class AuthModule {}
