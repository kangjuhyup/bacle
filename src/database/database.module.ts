import { Global, Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { ChatMessage, ChatMessageSchema } from './schema/chat-message';
import { ChatRoom, ChatRoomSchema } from './schema/chat-room';
import { Group, GroupSchema } from './schema/group';
import { ChatRepository } from './repository/chat.repository';
import { GroupRepository } from './repository/group.repository';

const repositories = [ChatRepository, GroupRepository];

@Global()
@Module({
  imports: [
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (config: ConfigService) => ({
        uri: config.get<string>('MONGO_HOST'),
        useNewUrlParser: true,
        useUnifiedTopology: true,
        user: config.get<string>('MONGO_USER'),
        pass: config.get<string>('MONGO_PASSWORD'),
        dbName: config.get<string>('MONGO_DB_NAME', 'bacle'),
      }),
      inject: [ConfigService],
    }),
    MongooseModule.forFeature([
      { name: ChatMessage.name, schema: ChatMessageSchema },
      { name: ChatRoom.name, schema: ChatRoomSchema },
      { name: Group.name, schema: GroupSchema },
    ]),
  ],
  providers: [...repositories],
  exports: [...repositories],
})
export class DatabaseModule {}
