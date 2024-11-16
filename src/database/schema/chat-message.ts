import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

@Schema({ timestamps: true })
export class ChatMessage extends Document {
  @Prop({ type: Types.ObjectId, ref: 'ChatRoom', required: true })
  room: Types.ObjectId; // 해당 메시지가 속한 채팅방

  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  sender: Types.ObjectId; // 메시지 보낸 사용자

  @Prop({ required: true })
  content: string; // 메시지 내용

  @Prop({ default: false })
  isRead: boolean; // 읽음 여부

  @Prop({ type: Date, default: Date.now })
  sentAt: Date; // 전송 시간

  readonly _id: Types.ObjectId;
}

export const ChatMessageSchema = SchemaFactory.createForClass(ChatMessage);
