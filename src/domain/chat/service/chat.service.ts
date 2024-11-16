import { ChatRepository } from '@database/repository/chat.repository';
import { Injectable } from '@nestjs/common';

@Injectable()
export class ChatService {
  constructor(private readonly chatRepository: ChatRepository) {}

  async createRoom(creator: string, name?: string) {
    const room = await this.chatRepository.createRoom([creator], name);
    return room._id.toHexString();
  }

  async joinRoom(roomId: string, userId: string) {
    const room = await this.chatRepository.joinRoom(roomId, userId);
    return room._id.toHexString();
  }

  async leaveRoom(roomId: string, userId: string) {
    const room = await this.chatRepository.leaveRoom(roomId, userId);
    return room._id.toHexString();
  }

  async sendMessage(roomId: string, sender: string, content: string) {
    return this.chatRepository.createMessage(roomId, sender, content);
  }

  async getMessages(roomId: string) {
    return this.chatRepository.findMessagesByRoom(roomId);
  }

  async markMessagesAsRead(roomId: string, userId: string) {
    await this.chatRepository.markMessagesAsRead(roomId, userId);
  }
}
