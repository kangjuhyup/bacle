import {
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { ChatFacade } from './chat.facade';
import { WsUser } from '@auth/decorator/ws.decorator';
import { User } from '@auth/user';
import { UseGuards } from '@nestjs/common';
import { WsJwtAuthGuard } from '@auth/guard/ws.guard';

@WebSocketGateway({
  cors: {
    origin: 'https://bacle.gg',
  },
})
export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {
  constructor(private readonly chatFacade: ChatFacade) {}

  @WebSocketServer()
  server: Server;

  private users: Map<string, string> = new Map(); // 소켓 ID와 사용자 ID 매핑

  handleConnection(client: Socket) {
    console.log(`Client connected: ${client.id}`);
  }

  handleDisconnect(client: Socket) {
    console.log(`Client disconnected: ${client.id}`);
    this.users.delete(client.id); // 연결 해제 시 사용자 제거
  }

  @SubscribeMessage('joinRoom')
  @UseGuards(WsJwtAuthGuard)
  async handleJoinRoom(
    client: Socket,
    payload: { room: string },
    @WsUser() user: User,
  ) {
    const { room } = payload;

    // 사용자를 룸에 추가
    client.join(room);
    this.users.set(client.id, user.uuid);

    const chatRoom = await this.chatFacade.joinRoom(room, user.uuid);
    const messageHistories = await this.chatFacade.getMessages(room);
    client.emit('histories', messageHistories);
    // 알림 메시지 방송
    this.server.to(room).emit('message', {
      username: 'System',
      content: `${user} has joined the room.`,
    });

    console.log(`${user} joined room: ${chatRoom}`);
  }

  @SubscribeMessage('leaveRoom')
  @UseGuards(WsJwtAuthGuard)
  handleLeaveRoom(
    client: Socket,
    payload: { room: string },
    @WsUser() user: User,
  ) {
    const { room } = payload;

    // 사용자를 룸에서 제거
    client.leave(room);
    this.users.delete(client.id);

    this.chatFacade.leaveRoom(room, user.uuid);
    // 알림 메시지 방송
    this.server.to(room).emit('message', {
      username: 'System',
      content: `${user} has left the room.`,
    });
    console.log(`${user} left room: ${room}`);
  }

  @SubscribeMessage('sendMessage')
  handleSendMessage(
    client: Socket,
    payload: { room: string; username: string; content: string },
  ) {
    const { room, username, content } = payload;
    this.chatFacade.sendMessage(room, username, content);
    // 룸에 메시지 전송
    this.server.to(room).emit('message', { username, content });
    console.log(`Message from ${username} to room ${room}: ${content}`);
  }
}
