import * as dotenv from 'dotenv';
dotenv.config();
import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { User } from '../../entities/user/user.entity';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { UserService } from '../../modules/user/service/user.service';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { RefreshToken } from '../../entities/refresh-token/refresh-token.entity';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly userService: UserService,
    @InjectRepository(RefreshToken)
    private readonly refreshTokenRepo: Repository<RefreshToken>,
  ) {}

  async validateUser(payload: { email: string; password: string }): Promise<User> {
    const user = await this.userService.getUserByEmail(payload.email);
    if (!user || !user.passwordHash) {
      throw new UnauthorizedException('Invalid email or password');
    }
    const isPasswordValid = await bcrypt.compare(
      payload.password,
      user.passwordHash,
    );
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid email or password');
    }
    return user;
  }

  async getTokens(userId: number, email: string, role: string) {
    const [at, rt] = await Promise.all([
      this.jwtService.signAsync(
        { id: userId, email, role },
        {
          secret: process.env.JWT_SECRET!,
          expiresIn: (process.env.JWT_EXPIRES_IN ?? '1h') as any,
        },
      ),
      this.jwtService.signAsync(
        { id: userId, email, role },
        {
          secret: process.env.JWT_REFRESH_TOKEN_SECRET!,
          expiresIn: '7d',
        },
      ),
    ]);
    return { accessToken: at, refreshToken: rt };
  }

  async signIn(user: User) {
    const { accessToken, refreshToken } = await this.getTokens(
      user.id,
      user.email,
      user.role,
    );
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7);
    await this.refreshTokenRepo.save({
      userId: user.id,
      token: refreshToken,
      expiresAt,
    });
    const expiresIn = process.env.JWT_EXPIRES_IN ?? '1h';
    const expiryMs = expiresIn.endsWith('h')
      ? parseInt(expiresIn, 10) * 60 * 60 * 1000
      : 3600000;
    return {
      accessToken,
      accessTokenExpiry: Date.now() + expiryMs,
      refreshToken,
    };
  }

  async refreshToken(refreshToken: string) {
    const stored = await this.refreshTokenRepo.findOne({
      where: { token: refreshToken },
      relations: ['user'],
    });
    if (!stored || stored.expiresAt < new Date()) {
      throw new UnauthorizedException('Invalid or expired refresh token');
    }
    await this.refreshTokenRepo.delete({ id: stored.id });
    return this.signIn(stored.user);
  }

  async signupWithEmailPassword(
    fullName: string,
    email: string,
    password: string,
  ) {
    const existingUser = await this.userService.getUserByEmail(email);
    if (existingUser) {
      throw new BadRequestException('User with this email already exists');
    }
    const saltRounds = 10;
    const passwordHash = await bcrypt.hash(password, saltRounds);
    const user = await this.userService.createUser({
      fullName,
      email,
      passwordHash,
    });
    return this.signIn(user);
  }
}
