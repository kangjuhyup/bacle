import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Group } from '../schema/group';

@Injectable()
export class GroupRepository {
  constructor(
    @InjectModel(Group.name) private readonly groupModel: Model<Group>,
  ) {}

  async createGroup({
    room,
    title,
    description,
    levels,
    jobs,
    creatorId,
    creatorNickname,
  }: {
    room: string;
    title: string;
    description: string;
    levels: number[];
    jobs: string[];
    creatorId: string;
    creatorNickname: string;
  }): Promise<Group> {
    const party = new this.groupModel({
      room,
      title,
      description,
      levels,
      jobs,
      creatorId,
      creatorNickname,
    });
    return party.save();
  }

  async findGroupById(id: string): Promise<Group | null> {
    return this.groupModel.findById(id).exec();
  }

  async findGroups(filter?: {
    creatorId?: string;
    name?: string;
    job?: string;
    level?: number;
    createdAt?: Date;
  }): Promise<Group[]> {
    const query = {}; // 기본적으로 빈 쿼리 (모든 데이터를 반환)

    if (filter?.creatorId) {
      query['creatorId'] = filter.creatorId; // creatorId 조건 추가
    }

    if (filter?.name) {
      query['name'] = { $regex: filter.name, $options: 'i' }; // 이름 조건 추가 (대소문자 무시)
    }

    if (filter?.createdAt) {
      query['createdAt'] = { createdAt: { $gte: filter.createdAt } };
    }

    if (filter?.job) {
      query['jobs'] = { $in: [filter.job] }; // jobs 배열에 job 포함 여부 확인
    }

    if (filter?.level !== undefined) {
      query['levels'] = { $in: [filter.level] }; // levels 배열에 level 포함 여부 확인
    }

    return this.groupModel.find(query).exec(); // 동적으로 구성된 쿼리 실행
  }

  async updateGroup(
    id: string,
    updateData: Partial<Group>,
  ): Promise<Group | null> {
    return this.groupModel
      .findByIdAndUpdate(id, updateData, { new: true })
      .exec();
  }

  async deleteGroup(id: string): Promise<void> {
    await this.groupModel.findByIdAndDelete(id).exec();
  }
}
