import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { GroupFacade } from './group.facade';
import { CreateGroupRequest } from './dto/request/create-group';
import { GetGroupsRequest } from './dto/request/get-groups';
import { HttpJwtAuthGuard } from '@auth/guard/http.guard';
import { HttpUser } from '@auth/decorator/http.decorator';
import { User } from '@auth/user';

@Controller('group')
export class GroupController {
  constructor(private readonly groupFacade: GroupFacade) {}

  @Post()
  @UseGuards(HttpJwtAuthGuard)
  async createGroup(@Body() dto: CreateGroupRequest, @HttpUser() user: User) {
    return await this.groupFacade.createGroup(dto, user);
  }

  @Get()
  @UseGuards(HttpJwtAuthGuard)
  async getGroups(@Query() dto: GetGroupsRequest, @HttpUser() user: User) {
    return await this.groupFacade.getGroups(dto, user);
  }

  @Get('/:id')
  @UseGuards(HttpJwtAuthGuard)
  async getGroup(@Param() id: string) {
    return await this.groupFacade.getGroup(id);
  }
}
