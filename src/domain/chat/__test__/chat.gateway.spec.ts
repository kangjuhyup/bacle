import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import { Server } from 'socket.io';
import { createServer } from 'http';
import { io, Socket } from 'socket.io-client';
import { ChatFacade } from '../chat.facade';
import { ChatGateway } from '../chat.gateway';
import { WsJwtAuthGuard } from '@auth/guard/ws.guard';
import { ConfigService } from '@nestjs/config';
import { HttpService } from '@nestjs/axios';

describe('ChatGateway', () => {
  let app: INestApplication;
  let chatGateway: ChatGateway;
  let wsServer: Server;
  let chatFacade: ChatFacade;
  let httpServer: any;
  let socketClient: Socket;
  let server: Server;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ChatGateway,
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
          provide: ChatFacade,
          useValue: {
            joinRoom: jest.fn(),
            leaveRoom: jest.fn(),
            getMessages: jest.fn(() => Promise.resolve([{ content: 'Hi!' }])),
            sendMessage: jest.fn(),
          },
        },
      ],
    }).compile();

    chatGateway = module.get<ChatGateway>(ChatGateway);
    chatFacade = module.get<ChatFacade>(ChatFacade);

    app = module.createNestApplication();

    // HTTP 및 WebSocket 서버 설정
    httpServer = createServer();
    wsServer = new Server(httpServer, {
      cors: {
        origin: ['http://localhost'],
        credentials: true,
      },
    });

    // ChatGateway 인스턴스에 WebSocket 서버 바인딩
    chatGateway = module.get<ChatGateway>(ChatGateway);
    chatFacade = module.get<ChatFacade>(ChatFacade);
    chatGateway.server = wsServer;

    // HTTP 서버 실행
    httpServer.listen(4001);

    // WebSocket 클라이언트 연결
    socketClient = io('http://localhost:4001/chat', {
      transports: ['websocket'],
    });

    socketClient.on('connect', () => {
      console.log('Client connected');
    });

    socketClient.on('connect_error', (error) => {
      console.error('WebSocket connection error:', error);
    });
  });

  afterAll(() => {
    socketClient.close();
    server.close();
    httpServer.close();
  });

  it('joinRoom - 사용자가 방에 입장하고 메시지 기록을 받는지 확인', async (done) => {
    jest.spyOn(WsJwtAuthGuard.prototype, 'canActivate').mockResolvedValue(true);

    const room = 'testRoom';
    const user = { uuid: '1234', username: 'testUser' };

    socketClient.emit('joinRoom', { room });

    socketClient.on('histories', (histories) => {
      expect(histories).toEqual([{ content: 'Hi!' }]);
      expect(chatFacade.joinRoom).toHaveBeenCalledWith(room, user.uuid);
      done();
    });
  });

  it('leaveRoom - 사용자가 방을 나가면 알림 메시지가 전송되는지 확인', async (done) => {
    jest.spyOn(WsJwtAuthGuard.prototype, 'canActivate').mockResolvedValue(true);
    const room = 'testRoom';
    const user = { uuid: '1234', username: 'testUser' };

    socketClient.emit('leaveRoom', { room });

    socketClient.on('message', (message) => {
      expect(message.content).toEqual(`${user.username} has left the room.`);
      expect(chatFacade.leaveRoom).toHaveBeenCalledWith(room, user.uuid);
      done();
    });
  });

  it('sendMessage - 메시지가 방 전체에 전송되는지 확인', async (done) => {
    jest.spyOn(WsJwtAuthGuard.prototype, 'canActivate').mockResolvedValue(true);
    const room = 'testRoom';
    const payload = {
      room,
      username: 'testUser',
      content: 'Hello, World!',
    };

    socketClient.emit('sendMessage', payload);

    socketClient.on('message', (message) => {
      expect(message).toEqual({
        username: payload.username,
        content: payload.content,
      });
      expect(chatFacade.sendMessage).toHaveBeenCalledWith(
        room,
        payload.username,
        payload.content,
      );
      done();
    });
  });
});
