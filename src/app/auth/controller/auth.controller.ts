import { Body, Controller, Post, Req, Request, UseGuards } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { AuthService } from '../service/auth.service';
import { AuthGuard } from '@nestjs/passport';
import { SignupRequestDto } from '../dto/request/signup.request.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @UseGuards(AuthGuard('client-local'))
  @Post('verify')
  async verify(@Request() req: any) {
    return await this.authService.signIn(req.user);
  }

  @Post('refresh')
  async refreshToken(@Req() req: Request) {
    const jwtService = new JwtService();

    const authorization = req.headers['authorization'];

    const token = authorization.split(' ')[1];

    const payload = await jwtService.verifyAsync(token, {
      secret: process.env.JWT_REFRESH_TOKEN_SECRET,
    });
    return await this.authService.refreshToken(payload);
  }

  @Post('signup')
  async signup(@Body() signupDto: SignupRequestDto) {
    return await this.authService.signupWithEmailPassword(
      signupDto.fullName,
      signupDto.email,
      signupDto.password,
    );
  }
}
