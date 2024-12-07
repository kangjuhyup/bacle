import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { WsException } from '@nestjs/websockets';
import { BaseGuard } from './base.guard';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class WsJwtAuthGuard extends BaseGuard implements CanActivate {
  constructor(config: ConfigService, http: HttpService) {
    super(config, http);
  }
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const client = context.switchToWs().getClient();
    const token = client.handshake?.headers?.authorization?.split(' ')[1]; // Bearer 토큰 추출

    if (!token) {
      throw new WsException('Token not provided');
    }

    try {
      // 외부 API 호출로 사용자 프로필 가져오기
      const profile = await this.getUserProfile(token);
      client.user = profile; // profile 데이터를 client.user에 설정
    } catch (error) {
      throw new WsException('Invalid token or unable to fetch profile');
    }

    return true;
  }
}
