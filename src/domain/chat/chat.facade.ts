import { Injectable } from '@nestjs/common';
import { ChatService } from './service/chat.service';

@Injectable()
export class ChatFacade {
  constructor(private readonly chatService: ChatService) {}

  async sendMessage(roomId: string, sender: string, content: string) {
    return this.chatService.sendMessage(roomId, sender, content);
  }

  async joinRoom(roomId: string, userId: string) {
    return this.chatService.joinRoom(roomId, userId);
  }

  async leaveRoom(roomId: string, userId: string) {
    return this.chatService.leaveRoom(roomId, userId);
  }

  async getMessages(roomId: string) {
    return this.chatService.getMessages(roomId);
  }

  async markMessagesAsRead(roomId: string, userId: string) {
    return this.chatService.markMessagesAsRead(roomId, userId);
  }
}
