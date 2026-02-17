import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-local';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthService } from '../service/auth.service';

@Injectable()
export class ClientLocalStrategy extends PassportStrategy(Strategy, 'client-local') {
  constructor(private authService: AuthService) {
    super({
      usernameField: 'email', // Map email field to username
      passwordField: 'password', // Required by passport-local
      passReqToCallback: true, // This allows us to access req in validate
    });
  }

  async validate(req: any): Promise<any> {

    const user = await this.authService.validateUser(req.body);
    
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }
    
    return user;
  }
}
