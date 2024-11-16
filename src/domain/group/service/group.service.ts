import { Injectable } from '@nestjs/common';
import { User } from '@auth/user';
import { ZonedDateTime, ZoneId, Duration } from '@js-joda/core';
import { GroupRepository } from '@database/repository/group.repository';
import { CreateGroupRequest } from '../dto/request/create-group';
import { GetGroupsRequest } from '../dto/request/get-groups';

@Injectable()
export class GroupService {
  constructor(private readonly groupRepository: GroupRepository) {}

  async createGroup(
    param: CreateGroupRequest & { creatorId: string; room: string },
  ) {
    const group = await this.groupRepository.createGroup(param);
    return group._id.toHexString();
  }

  async getGroup(id: string) {
    return await this.groupRepository.findGroupById(id);
  }

  async getGroups(dto: GetGroupsRequest, user: User) {
    const creatorId = dto.mine === true ? user.uuid : undefined;
    const now = ZonedDateTime.now(ZoneId.SYSTEM);
    const twentyFourHoursAgo = now.minus(Duration.ofHours(24));

    return await this.groupRepository.findGroups({
      ...dto,
      creatorId,
      createdAt: new Date(twentyFourHoursAgo.toInstant().toEpochMilli()),
    });
  }
}
