import { Module } from '@nestjs/common';
import { ChatService } from './service/chat.service';
import { ChatFacade } from './chat.facade';
import { ChatGateway } from './chat.gateway';

const services = [ChatService];

@Module({
  providers: [...services, ChatGateway, ChatFacade],
  exports: [...services],
})
export class ChatModule {}
