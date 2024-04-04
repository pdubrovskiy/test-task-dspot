import { Profiles } from 'src/core/profiles/profiles.entity';
import { HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindManyOptions, FindOptionsRelations, FindOptionsWhere, In, Repository } from 'typeorm';
import { LogicException } from 'src/common/exceptions/logic.exception';
import { ExceptionMessages } from 'src/common/exceptions/exception-messages';
import { PageMeta } from 'src/common/pagination/page-meta';
import { PageData } from 'src/common/pagination/page-data';
import { GetProfilesDto } from './dto/get-profiles.dto';

@Injectable()
export class ProfilesRepository {
  constructor(
    @InjectRepository(Profiles)
    private repository: Repository<Profiles>,
  ) {}

  async getAll(dto: GetProfilesDto): Promise<PageData<Profiles>> {
    const findOptions: FindManyOptions<Profiles> = PageMeta.generateFindOptions(
      dto.perPage,
      dto.page,
    );
    const total = await this.repository.count(findOptions);
    const profiles: Profiles[] = await this.repository.find({
      ...findOptions,
      relations: ['friends'],
    });

    const pageMeta = PageMeta.generateMeta(total, dto.perPage, dto.page);
    const pageData = new PageData(profiles, pageMeta);

    return pageData;
  }

  async create(friendIds: number[], profileData: Partial<Profiles>): Promise<Profiles> {
    const profile: Profiles = this.repository.create(profileData);
    const friends = await this.repository.find({
      where: { id: In(friendIds) },
      relations: ['friends'],
    });
    profile.friends = friends;

    let newProfile = await this.repository.save(profile);

    delete newProfile.friends;
    for (const friend of friends) {
      const temp = friend.friends;
      friend.friends = [];
      await this.repository.save(friend);
      friend.friends = [...temp, newProfile];
      await this.repository.save(friend);
    }
    newProfile = await this.findOneByOptions({ id: newProfile.id }, { friends: true });

    return newProfile;
  }

  async update(
    profile: Profiles,
    profileData: Partial<Profiles>,
    friendIds: number[],
  ): Promise<Profiles> {
    this.repository.merge(profile, profileData);

    if (Array.isArray(friendIds)) {
      if (friendIds.includes(profile.id)) {
        throw new LogicException(ExceptionMessages.FRIEND_OWN, HttpStatus.UNPROCESSABLE_ENTITY);
      }
      profile.friends = [];
      await this.repository.save(profile);
      profile.friends = await this.repository.find({ where: { id: In(friendIds) } });
    }

    return this.repository.save(profile);
  }

  async delete(profileIds: number[]): Promise<void> {
    await this.repository.delete(profileIds);
  }

  async findShortestConnection(profileId1: number, profileId2: number): Promise<number[]> {
    const profile1 = await this.findOneByOptions({ id: profileId1 }, { friends: true });
    const profile2 = await this.findOneByOptions({ id: profileId2 }, { friends: true });

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
      const { friends } = await this.findOneByOptions({ id: profile.id }, { friends: true });

      for (const friend of friends) {
        if (!visited.has(friend.id)) {
          queue.push({ profile: friend, path: [...path, friend.id] });
        }
      }
    }

    return null;
  }

  async checkIfAllExist(ids: number[] = []): Promise<void> {
    const profiles = await this.repository.find({ where: { id: In(ids) } });
    const existingIds = profiles.map((profile) => profile.id);
    const missingIds = ids.filter((id) => !existingIds.includes(id));

    if (missingIds.length > 0) {
      const message = missingIds.map((id) => `${id}-element doesn't exist in database`).join(';');

      throw new LogicException(
        ExceptionMessages.UNPROCESSABLE_ENTITY,
        HttpStatus.UNPROCESSABLE_ENTITY,
        message,
      );
    }
  }

  async findOneByOptions(
    where: FindOptionsWhere<Profiles>,
    relations: FindOptionsRelations<Profiles> = {},
  ): Promise<Profiles> {
    return this.repository.findOne({
      where,
      relations,
    });
  }
}
