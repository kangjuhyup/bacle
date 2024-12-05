import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { BaseGuard } from './base.guard';
import { ConfigService } from '@nestjs/config';
import { HttpService } from '@nestjs/axios';

@Injectable()
export class HttpJwtAuthGuard extends BaseGuard implements CanActivate {
  constructor(
    config: ConfigService,
    http: HttpService,
  ) {
    super(config, http);
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();

    const token = request.headers?.authorization?.split(' ')[1];

    if (!token) {
      throw new UnauthorizedException('Token not provided');
    }

    try {
      const profile = await this.getUserProfile(token);
      request.user = profile;
    } catch (error) {
      throw new UnauthorizedException(
        `Invalid token or unable to fetch profile: ${error.message}`,
      );
    }

    return true;
  }
}
