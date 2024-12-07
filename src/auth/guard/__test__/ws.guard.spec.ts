import { ConfigService } from '@nestjs/config';
import { HttpService } from '@nestjs/axios';
import { ExecutionContext } from '@nestjs/common';
import { WsException } from '@nestjs/websockets';
import { WsJwtAuthGuard } from '../ws.guard';

describe('WsJwtAuthGuard (Real API)', () => {
  let guard: WsJwtAuthGuard;
  let configService: ConfigService;
  let httpService: HttpService;

  const mockAccessToken = `Bearer eyJhbGciOiJIUzI1NiIsImtpZCI6ImNYdm8rMThLc1FkOXJ4NDgiLCJ0eXAiOiJKV1QifQ.eyJpc3MiOiJodHRwczovL2FqaWFjcmJxd3JocXhnc3VpeW12LnN1cGFiYXNlLmNvL2F1dGgvdjEiLCJzdWIiOiIzMGM3YjZhNC1lZDhlLTQ4OGItYWQzNi02ZjEzOWNiZWI0NWEiLCJhdWQiOiJhdXRoZW50aWNhdGVkIiwiZXhwIjoxNzMzNzE0MjA3LCJpYXQiOjE3MzMxMDk0MDcsImVtYWlsIjoic3ByaW5nZGF5OTNAbmF2ZXIuY29tIiwicGhvbmUiOiIiLCJhcHBfbWV0YWRhdGEiOnsicHJvdmlkZXIiOiJkaXNjb3JkIiwicHJvdmlkZXJzIjpbImRpc2NvcmQiXX0sInVzZXJfbWV0YWRhdGEiOnsiYXZhdGFyX3VybCI6Imh0dHBzOi8vY2RuLmRpc2NvcmRhcHAuY29tL2VtYmVkL2F2YXRhcnMvMC5wbmciLCJjdXN0b21fY2xhaW1zIjp7Imdsb2JhbF9uYW1lIjoiU3ByaW5nZGF5In0sImVtYWlsIjoic3ByaW5nZGF5OTNAbmF2ZXIuY29tIiwiZW1haWxfdmVyaWZpZWQiOmZhbHNlLCJmdWxsX25hbWUiOiJzcHJpbmdkYXk5MyIsImlzcyI6Imh0dHBzOi8vZGlzY29yZC5jb20vYXBpIiwibmFtZSI6InNwcmluZ2RheTkzIzAiLCJwaG9uZV92ZXJpZmllZCI6ZmFsc2UsInBpY3R1cmUiOiJodHRwczovL2Nkbi5kaXNjb3JkYXBwLmNvbS9lbWJlZC9hdmF0YXJzLzAucG5nIiwicHJvdmlkZXJfaWQiOiIxMjcyMzk4NzIzNDM1MjA0NjgxIiwic3ViIjoiMTI3MjM5ODcyMzQzNTIwNDY4MSJ9LCJyb2xlIjoiYXV0aGVudGljYXRlZCIsImFhbCI6ImFhbDEiLCJhbXIiOlt7Im1ldGhvZCI6Im9hdXRoIiwidGltZXN0YW1wIjoxNzMzMTA5NDA3fV0sInNlc3Npb25faWQiOiIwZGFhMTVjZi1jODZlLTQ3NDMtYjM5My1lZWEyZDkzYjg2MTciLCJpc19hbm9ueW1vdXMiOmZhbHNlfQ.41YbATB90wEWkjv-sNL0EdzYZcAkH7IwgvEbO2Uy1zU`;
  const realApiUrl = 'https://bacl.gg/v2/user/profile';

  beforeEach(() => {
    configService = new ConfigService();
    httpService = new HttpService();

    jest.spyOn(configService, 'get').mockReturnValue(realApiUrl);

    guard = new WsJwtAuthGuard(configService, httpService);
  });

  it('should fetch user profile from real API using valid token', async () => {
    const mockClient = {
      handshake: {
        headers: { authorization: `Bearer ${mockAccessToken}` },
      },
      user: {},
    };

    const mockContext = {
      switchToWs: () => ({
        getClient: () => mockClient,
      }),
    } as unknown as ExecutionContext;

    const result = await guard.canActivate(mockContext);

    expect(result).toBe(true);

    // client.user가 실제 API에서 받은 데이터를 포함하는지 확인
    expect(mockClient.user).toBeDefined();
  });

  it('should throw WsException if token is invalid with real API', async () => {
    const invalidToken = 'INVALID_TOKEN';

    const mockClient = {
      handshake: {
        headers: { authorization: `Bearer ${invalidToken}` },
      },
    };

    const mockContext = {
      switchToWs: () => ({
        getClient: () => mockClient,
      }),
    } as unknown as ExecutionContext;

    await expect(guard.canActivate(mockContext)).rejects.toThrowError(
      new WsException('Invalid token or unable to fetch profile'),
    );
  });
});
