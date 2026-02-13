import * as dotenv from 'dotenv';
dotenv.config();
import { BadRequestException, Injectable, UnauthorizedException } from '@nestjs/common';
import { Role, User } from 'src/app/entities/user/user.entity';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { UserService } from 'src/app/modules/user/service/user.service';

@Injectable()
export class AuthService {
  constructor(private readonly jwtService: JwtService, private readonly userService: UserService) {}
  async validateUser(payload: any): Promise<User> {
    const user = await this.userService.getUserByEmail(payload.email);
    if (!user) {
      throw new UnauthorizedException('Invalid email or password');
    }
    const isPasswordValid = await bcrypt.compare(payload.password, user.passwordHash);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid email or password');
    }
    return user;
  }

  async getTokens(id: string, email: string, role: string) {
    const [at, rt] = await Promise.all([
      this.jwtService.signAsync({ id, email, role },{ secret: process.env.JWT_SECRET!,expiresIn: '1h' }),
      this.jwtService.signAsync({ id, email, role },{ secret: process.env.JWT_REFRESH_TOKEN_SECRET!,expiresIn: '7d' }),
    ]);

    return {
      accessToken: at,
      accessTokenExpiry: Date.now() + 3000000, //600000 // 3000000 === 50 min
      refreshToken: rt,
    };
  }

  async signIn(user: User) {
    const tokenData = await this.getTokens(user.id, user.email,user.role);

    return {
      accessToken: tokenData.accessToken,
      accessTokenExpiry: tokenData.accessTokenExpiry,
      refreshToken: tokenData.refreshToken,
    };
  }

  async refreshToken(payload: any) {
    const tokenData = await this.getTokens(payload.id, payload.email, payload.role);

    return {
      accessToken: tokenData.accessToken,
      accessTokenExpiry: tokenData.accessTokenExpiry,
      refreshToken: tokenData.refreshToken,
    };
  }


  async signupWithEmailPassword(fullName: string, email: string, password: string) {
    // Check if user already exists
    const existingUser = await this.userService.getUserByEmail(email);
    
    if (existingUser) {
      throw new BadRequestException('User with this email already exists');
    }

    // Hash the password
    const saltRounds = 10;
    const passwordHash = await bcrypt.hash(password, saltRounds);

    // Create user
    const user = await this.userService.createUser({
      email,
      fullName,
      password: passwordHash,
    });

    // Return tokens
    return await this.signIn(user);
  }
}
