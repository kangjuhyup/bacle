import { Global, Module } from '@nestjs/common';
import { ChatService } from './service/chat.service';
import { ChatFacade } from './chat.facade';
import { ChatGateway } from './chat.gateway';
import { HttpModule } from '@nestjs/axios';

const services = [ChatService];

@Module({
  imports: [HttpModule.register({})],
  providers: [...services, ChatGateway, ChatFacade],
  exports: [...services],
})
export class ChatModule {}
