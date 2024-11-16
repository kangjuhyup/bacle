import { ChatModule } from '@domain/chat/chat.module';
import { Module } from '@nestjs/common';
import { GroupController } from './group.controller';
import { GroupFacade } from './group.facade';
import { GroupService } from './service/group.service';

const services = [GroupService];

@Module({
  imports: [ChatModule],
  controllers: [GroupController],
  providers: [...services, GroupFacade],
  exports: [...services],
})
export class GroupModule {}
