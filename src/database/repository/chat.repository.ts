import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ChatRoom } from '../schema/chat-room';
import { ChatMessage } from '../schema/chat-message';

@Injectable()
export class ChatRepository {
  constructor(
    @InjectModel(ChatRoom.name) private readonly chatRoomModel: Model<ChatRoom>,
    @InjectModel(ChatMessage.name)
    private readonly chatMessageModel: Model<ChatMessage>,
  ) {}

  async createRoom(participants: string[], name?: string): Promise<ChatRoom> {
    const room = new this.chatRoomModel({ participants, name });
    return room.save();
  }

  async joinRoom(roomId: string, participant: string): Promise<ChatRoom> {
    return this.chatRoomModel
      .findByIdAndUpdate(
        roomId,
        { $addToSet: { participants: participant } }, // 중복되지 않게 추가
        { new: true },
      )
      .exec();
  }

  async leaveRoom(roomId: string, participant: string): Promise<ChatRoom> {
    return this.chatRoomModel
      .findByIdAndUpdate(
        roomId,
        { $pull: { participants: participant } }, // 배열에서 특정 참가자를 제거
        { new: true },
      )
      .exec();
  }

  async findRoomByParticipants(
    participants: string[],
  ): Promise<ChatRoom | null> {
    return this.chatRoomModel
      .findOne({
        participants: { $all: participants, $size: participants.length },
      })
      .exec();
  }

  async getRoomById(roomId: string): Promise<ChatRoom> {
    return this.chatRoomModel.findById(roomId).exec();
  }

  async createMessage(
    roomId: string,
    sender: string,
    content: string,
  ): Promise<ChatMessage> {
    const message = new this.chatMessageModel({
      room: roomId,
      sender,
      content,
    });
    return message.save();
  }

  async findMessagesByRoom(roomId: string): Promise<ChatMessage[]> {
    return this.chatMessageModel
      .find({ room: roomId })
      .sort({ sentAt: 1 })
      .exec();
  }

  async markMessagesAsRead(roomId: string, userId: string): Promise<void> {
    await this.chatMessageModel
      .updateMany(
        { room: roomId, sender: { $ne: userId }, isRead: false },
        { $set: { isRead: true } },
      )
      .exec();
  }
}
