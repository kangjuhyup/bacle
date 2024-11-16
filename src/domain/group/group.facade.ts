import { Injectable } from '@nestjs/common';
import { ChatService } from '../chat/service/chat.service';
import { GroupService } from './service/group.service';
import { CreateGroupResponse } from './dto/response/create-group';
import { CreateGroupRequest } from './dto/request/create-group';
import { User } from '@auth/user';
import { GetGroupsRequest } from './dto/request/get-groups';

@Injectable()
export class GroupFacade {
  constructor(
    private readonly chat: ChatService,
    private readonly group: GroupService,
  ) {}

  async createGroup(
    dto: CreateGroupRequest,
    user: User,
  ): Promise<CreateGroupResponse> {
    const chatId = await this.chat.createRoom(user.uuid);
    const groupId = await this.group.createGroup({
      ...dto,
      room: chatId,
      creatorId: user.uuid,
    });
    return {
      groupId,
      chatId,
    };
  }

  async getGroup(id: string) {
    return await this.group.getGroup(id);
  }
  async getGroups(dto: GetGroupsRequest, user: User) {
    return await this.group.getGroups(dto, user);
  }
}
