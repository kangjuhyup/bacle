import { ChatModule } from '@domain/chat/chat.module';
import { Module } from '@nestjs/common';
import { GroupController } from './group.controller';
import { GroupFacade } from './group.facade';
import { GroupService } from './service/group.service';
import { HttpModule } from '@nestjs/axios';

const services = [GroupService];

@Module({
  imports: [
    ChatModule,
    HttpModule.register({
      timeout: 5000,
    }),
  ],
  controllers: [GroupController],
  providers: [...services, GroupFacade],
  exports: [...services],
})
export class GroupModule {}
