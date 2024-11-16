import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { WsException } from '@nestjs/websockets';
import { firstValueFrom } from 'rxjs';

export abstract class BaseGuard {
  constructor(
    private readonly config: ConfigService,
    private readonly http: HttpService,
  ) {}

  // 공통 로직: 토큰에서 사용자 프로필을 가져오는 기본 구현
  async getUserProfile(token: string): Promise<any> {
    const url = this.config.get<string>('BACLE_AUTH');
    const headers = { Authorization: `Bearer ${token}` };

    try {
      const response = await firstValueFrom(this.http.get(url, { headers }));
      return response.data;
    } catch (error) {
      console.error('Failed to fetch user profile:', error.message);
      throw new WsException('Failed to fetch user profile');
    }
  }
}