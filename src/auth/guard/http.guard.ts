import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { BaseGuard } from './base.guard';

@Injectable()
export class HttpJwtAuthGuard extends BaseGuard implements CanActivate {
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();

    // Authorization 헤더에서 Bearer 토큰 추출
    const token = request.headers?.authorization?.split(' ')[1];

    if (!token) {
      throw new UnauthorizedException('Token not provided');
    }

    try {
      const profile = await this.getUserProfile(token);
      request.user = profile;
    } catch (error) {
      throw new UnauthorizedException(
        `Invalid token or unable to fetch profile : ${error.message}`,
      );
    }

    return true;
  }
}
