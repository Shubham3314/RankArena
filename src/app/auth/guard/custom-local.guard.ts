import {
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class CustomLocalGuard extends AuthGuard('client-local') {
  async canActivate(context: ExecutionContext): Promise<boolean> {
    // Call parent canActivate which will use the strategy
    try {
      return (await super.canActivate(context)) as boolean;
    } catch (error) {
      throw new UnauthorizedException('Authentication failed');
    }
  }
}

