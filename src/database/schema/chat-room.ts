import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

@Schema({ timestamps: true })
export class ChatRoom extends Document {
  @Prop({ type: [String], required: true })
  participants: string[]; // 채팅방 참여자

  @Prop({ type: String })
  name?: string; // 채팅방 이름 (옵션)

  @Prop({ type: Date, default: Date.now })
  createdAt: Date; // 생성 시간

  readonly _id: Types.ObjectId;
}

export const ChatRoomSchema = SchemaFactory.createForClass(ChatRoom);
