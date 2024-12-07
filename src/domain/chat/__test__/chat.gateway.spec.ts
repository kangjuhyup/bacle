import { Test, TestingModule } from '@nestjs/testing';
import { WsJwtAuthGuard } from '@auth/guard/ws.guard';
import { WsUser } from '@auth/decorator/ws.decorator'; // WsUser 데코레이터 임포트
import { ExecutionContext, INestApplication } from '@nestjs/common';
import { Server } from 'socket.io';
import { io, Socket } from 'socket.io-client';
import { ChatFacade } from '../chat.facade';
import { ChatGateway } from '../chat.gateway';
import { ConfigService } from '@nestjs/config';
import { HttpService } from '@nestjs/axios';

describe('ChatGateway', () => {
  let app: INestApplication;
  let server: Server;
  let clientSocket: Socket;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      providers: [
        ChatGateway,
        {
          provide: ChatFacade,
          useValue: {
            joinRoom: jest.fn().mockResolvedValue('chatRoom'),
            getMessages: jest.fn().mockResolvedValue([]),
            leaveRoom: jest.fn().mockResolvedValue(undefined),
            sendMessage: jest.fn().mockResolvedValue(undefined),
          },
        },
        {
          provide: ConfigService,
          useValue: {
            get: jest.fn(),
          },
        },
        {
          provide: HttpService,
          useValue: {
            get: jest.fn(),
          },
        },
        {
          provide: WsJwtAuthGuard,
          useValue: {
            canActivate: jest.fn(() => true), // 가드 모킹
          },
        },
      ],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();

    server = app.getHttpServer();
  });

  afterAll(async () => {
    if (clientSocket) {
      clientSocket.disconnect();
    }
    await app.close();
  });

  beforeEach(() => {
    // @WsUser() 데코레이터 모킹
    const mockExecutionContext = {
      switchToWs: jest.fn().mockReturnThis(),
      getClient: jest.fn().mockReturnValue({
        user: { uuid: 'user123' },
      }),
      getData: jest.fn().mockReturnValue({
        room: 'testRoom',
      }),
    } as unknown as ExecutionContext;

    jest.spyOn(mockExecutionContext, 'switchToWs').mockReturnValue({
      getClient: jest.fn().mockReturnValue({ user: { uuid: 'user123' } }),
      getData: jest.fn().mockReturnValue({ room: 'testRoom' }),
    });
  });

  it('should be able to connect to WebSocket server', (done) => {
    clientSocket = io('http://localhost:4001/chat', {
      transports: ['websocket'],
    });

    clientSocket.on('connect', () => {
      expect(clientSocket.connected).toBe(true);
      done();
    });
  });

  it('should join room and broadcast message', (done) => {
    const room = 'testRoom';
    const user = { uuid: 'user123' };

    clientSocket.emit('joinRoom', { room });

    clientSocket.on('message', (message) => {
      expect(message.username).toBe('System');
      expect(message.content).toContain('has joined the room');
    });
  });

  it('should leave room and broadcast message', async () => {
    const room = 'testRoom';

    clientSocket.emit('leaveRoom', { room });

    const message: any = await new Promise((resolve, reject) => {
      clientSocket.on('message', (message) => {
        console.log('leaveRoom message : ', message);
        resolve(message); // 메세지가 오면 resolve로 반환
      });
    });

    // 메세지 내용이 예상한 값인지 확인
    expect(message.username).toBe('System');
    expect(message.content).toContain('has left the room');
  });

  it('should send message and broadcast to room', (done) => {
    const room = 'testRoom';
    const username = 'testUser';
    const content = 'Hello, World!';

    clientSocket.emit('sendMessage', { room, username, content });

    clientSocket.on('message', (message) => {
      expect(message.username).toBe(username);
      expect(message.content).toBe(content);
    });
  });
});
