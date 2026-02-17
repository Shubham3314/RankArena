import {
  Body,
  Controller,
  Post,
  Req,
  Request,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from '../service/auth.service';
import { CustomLocalGuard } from '../guard/custom-local.guard';
import { SignupRequestDto } from '../dto/request/signup.request.dto';
import { RefreshRequestDto } from '../dto/request/refresh.request.dto';
import { Throttle } from '@nestjs/throttler';


@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @UseGuards(CustomLocalGuard)
  @Post('login')
  async login(@Request() req: { user: any }) {
    return this.authService.signIn(req.user);
  }

  @Post('refresh')
  async refreshToken(@Body() dto: RefreshRequestDto) {
    return this.authService.refreshToken(dto.refreshToken);
  }

  @Post('signup')
  async signup(@Body() signupDto: SignupRequestDto) {
    return this.authService.signupWithEmailPassword(
      signupDto.fullName,
      signupDto.email,
      signupDto.password,
    );
  }
}
