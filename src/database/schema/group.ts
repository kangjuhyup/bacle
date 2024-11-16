import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

@Schema({ timestamps: true })
export class Group extends Document {
  @Prop({ type: Types.ObjectId, ref: 'ChatRoom', required: true })
  room: Types.ObjectId; // 해당 메시지가 속한 채팅방

  @Prop({ required: true })
  title: string; // 파티 제목

  @Prop({ required: true })
  description: string; // 파티 내용

  @Prop({ type: [Number], required: true })
  levels: number[]; // 레벨 배열

  @Prop({ type: [String], required: true })
  jobs: string[]; // 직업 배열

  @Prop({ required: true })
  creatorId: string; // 생성자 ID

  @Prop({ type: Date, default: Date.now })
  createdAt: Date; // 생성 시간

  @Prop({ required: true })
  creatorNickname: string; // 생성자 닉네임

  readonly _id: Types.ObjectId;
}

export const GroupSchema = SchemaFactory.createForClass(Group);
