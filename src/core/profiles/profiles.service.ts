import { HttpStatus, Inject, Injectable } from '@nestjs/common';
import { Profiles } from './profiles.entity';
import { LogicException } from 'src/common/exceptions/logic.exception';
import { ExceptionMessages } from 'src/common/exceptions/exception-messages';
import { PageData } from 'src/common/pagination/page-data';
import { GetProfilesDto } from './dto/get-profiles.dto';
import { Messages } from 'src/common/response_messages/messages';
import { CreateProfileDto } from './dto/create-profile.dto';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { ProfilesRepository } from './profiles.repository';

@Injectable()
export class ProfilesService {
  constructor(
    @Inject(ProfilesRepository)
    private repository: ProfilesRepository,
  ) {}

  async getAll(dto: GetProfilesDto): Promise<PageData<Profiles>> {
    const pageData = await this.repository.getAll(dto);

    return pageData;
  }

  async create(dto: CreateProfileDto): Promise<Profiles> {
    const { friendIds, ...profileData } = dto;

    await this.repository.checkIfAllExist(friendIds);
    const newProfile: Profiles = await this.repository.create(friendIds, profileData);

    return newProfile;
  }

  async getOneById(id: number): Promise<Profiles> {
    const profile = await this.repository.findOneByOptions({ id }, { friends: true });

    if (!profile) {
      throw new LogicException(ExceptionMessages.NOT_FOUND, HttpStatus.NOT_FOUND);
    }

    return profile;
  }

  async update(id: number, dto: UpdateProfileDto): Promise<Profiles> {
    const profile = await this.repository.findOneByOptions({ id }, { friends: true });
    const { friendIds, ...profileData } = dto;

    if (!profile) {
      throw new LogicException(ExceptionMessages.NOT_FOUND, HttpStatus.NOT_FOUND);
    }
    await this.repository.checkIfAllExist(friendIds);
    const updatedProfile = await this.repository.update(profile, profileData, friendIds);

    return updatedProfile;
  }

  async delete(ids: string): Promise<{
    message: Messages;
  }> {
    const profileIds: number[] = ids.split(',').map((id) => Number(id));

    await this.repository.checkIfAllExist(profileIds);
    await this.repository.delete(profileIds);

    return { message: Messages.SUCCESSFUL_OPERATION };
  }

  async getAllFriends(id: number): Promise<Profiles[]> {
    const profile = await this.repository.findOneByOptions({ id }, { friends: true });

    if (!profile) {
      throw new LogicException(ExceptionMessages.NOT_FOUND, HttpStatus.NOT_FOUND);
    }
    const { friends } = profile;

    return friends;
  }

  async findShortestConnection(profileId1: number, profileId2: number): Promise<number[]> {
    const profile1 = await this.repository.findOneByOptions({ id: profileId1 }, { friends: true });
    const profile2 = await this.repository.findOneByOptions({ id: profileId2 }, { friends: true });

    if (!profile1 || !profile2) {
      throw new LogicException(ExceptionMessages.NOT_FOUND, HttpStatus.NOT_FOUND);
    }

    const visited: Set<number> = new Set();
    const queue: { profile: Profiles; path: number[] }[] = [];

    visited.add(profile1.id);
    queue.push({ profile: profile1, path: [profile1.id] });

    while (queue.length > 0) {
      const { profile, path } = queue.shift();
      visited.add(profile.id);

      if (profile.id === profileId2) {
        return path;
      }
      const { friends } = await this.repository.findOneByOptions(
        { id: profile.id },
        { friends: true },
      );

      for (const friend of friends) {
        if (!visited.has(friend.id)) {
          queue.push({ profile: friend, path: [...path, friend.id] });
        }
      }
    }

    return null;
  }
}
