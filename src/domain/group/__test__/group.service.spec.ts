import { Test, TestingModule } from '@nestjs/testing';
import { GroupRepository } from '@database/repository/group.repository';
import { CreateGroupRequest } from '../dto/request/create-group';
import { GetGroupsRequest } from '../dto/request/get-groups';
import { User } from '@auth/user';
import { ZonedDateTime, ZoneId, Duration } from '@js-joda/core';
import { GroupService } from '../service/group.service';
import { Group } from '@database/schema/group';

describe('GroupService', () => {
  let groupService: GroupService;
  let groupRepository: jest.Mocked<GroupRepository>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        GroupService,
        {
          provide: GroupRepository,
          useValue: {
            createGroup: jest.fn(),
            findGroupById: jest.fn(),
            findGroups: jest.fn(),
          },
        },
      ],
    }).compile();

    groupService = module.get<GroupService>(GroupService);
    groupRepository = module.get(
      GroupRepository,
    ) as jest.Mocked<GroupRepository>;
  });

  describe('createGroup', () => {
    it('should create a group and return its id', async () => {
      const mockGroup = {
        _id: { toHexString: jest.fn().mockReturnValue('mockId') },
      } as unknown as Group;
      const createGroupDto: CreateGroupRequest & {
        creatorId: string;
        room: string;
      } = {
        title: '세작 사냥가실분',
        description: '90~95 격수 구해요',
        creatorNickname: '강웅관',
        levels: [90, 91, 92, 93, 94, 95],
        jobs: ['전사', '도적'],
        creatorId: 'user123',
        room: 'room123',
      };

      groupRepository.createGroup.mockResolvedValue(mockGroup);

      const result = await groupService.createGroup(createGroupDto);

      expect(groupRepository.createGroup).toHaveBeenCalledWith(createGroupDto);
      expect(result).toBe('mockId');
    });
  });

  describe('getGroup', () => {
    it('should return a group by id', async () => {
      const mockGroup = { name: 'Test Group' } as unknown as Group;
      const groupId = 'group123';

      groupRepository.findGroupById.mockResolvedValue(mockGroup);

      const result = await groupService.getGroup(groupId);

      expect(groupRepository.findGroupById).toHaveBeenCalledWith(groupId);
      expect(result).toBe(mockGroup);
    });
  });

  describe('getGroups', () => {
    it('should return groups filtered by criteria', async () => {
      const mockGroups = [
        { name: 'Group 1' },
        { name: 'Group 2' },
      ] as unknown as Group[];
      const dto: GetGroupsRequest = {
        mine: true,
        level: 1,
        job: 'warrior',
      };
      const user: User = { uuid: 'user123', username: 'testUser' } as User;

      const mockNow = ZonedDateTime.parse('2023-12-01T12:00:00+00:00');
      jest.spyOn(ZonedDateTime, 'now').mockReturnValue(mockNow);

      const twentyFourHoursAgo = mockNow.minus(Duration.ofHours(24));

      groupRepository.findGroups.mockResolvedValue(mockGroups);

      const result = await groupService.getGroups(dto, user);

      expect(groupRepository.findGroups).toHaveBeenCalledWith({
        ...dto,
        creatorId: user.uuid,
        createdAt: new Date(twentyFourHoursAgo.toInstant().toEpochMilli()),
      });
      expect(result).toBe(mockGroups);
    });

    it('should return all groups if "mine" is false', async () => {
      const mockGroups = [{ name: 'Group 1' }, { name: 'Group 2' }] as any[];
      const dto: GetGroupsRequest = {
        mine: false,
        level: 1,
        job: 'mage',
      };
      const user: User = { uuid: 'user123', username: 'testUser' } as User;

      const now = ZonedDateTime.now(ZoneId.SYSTEM);
      const twentyFourHoursAgo = now.minus(Duration.ofHours(24));

      groupRepository.findGroups.mockResolvedValue(mockGroups);

      const result = await groupService.getGroups(dto, user);

      expect(groupRepository.findGroups).toHaveBeenCalledWith({
        ...dto,
        creatorId: undefined,
        createdAt: new Date(twentyFourHoursAgo.toInstant().toEpochMilli()),
      });
      expect(result).toBe(mockGroups);
    });
  });
});
