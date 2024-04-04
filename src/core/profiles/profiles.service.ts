import { HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindManyOptions, FindOptionsRelations, FindOptionsWhere, In, Repository } from 'typeorm';
import { Profiles } from './profiles.entity';
import { LogicException } from 'src/common/exceptions/logic.exception';
import { ExceptionMessages } from 'src/common/exceptions/exception-messages';
import { PageMeta } from 'src/common/pagination/page-meta';
import { PageData } from 'src/common/pagination/page-data';
import { GetProfilesDto } from './dto/get-profiles.dto';
import { Messages } from 'src/common/response_messages/messages';
import { CreateProfileDto } from './dto/create-profile.dto';
import { UpdateProfileDto } from './dto/update-profile.dto';

@Injectable()
export class ProfilesService {
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
    const profiles: Profiles[] = await this.repository.find(findOptions);

    const pageMeta = PageMeta.generateMeta(total, dto.perPage, dto.page);
    const pageData = new PageData(profiles, pageMeta);

    return pageData;
  }

  async create(dto: CreateProfileDto): Promise<Profiles> {
    const { friendIds, ...profileData } = dto;

    await this.checkIfAllExist(friendIds);

    const profile: Profiles = this.repository.create(profileData);
    profile.friends = await this.repository.find({ where: { id: In(friendIds) } });

    return this.repository.save(profile);
  }

  async getOneById(id: number): Promise<Profiles> {
    const profile = await this.findOneByOption({ id }, { friends: true });

    if (!profile) {
      throw new LogicException(ExceptionMessages.NOT_FOUND, HttpStatus.NOT_FOUND);
    }

    return profile;
  }

  async update(id: number, dto: UpdateProfileDto): Promise<Profiles | undefined> {
    const profile = await this.findOneByOption({ id }, { friends: true });
    const { friendIds, ...profileData } = dto;

    if (!profile) {
      throw new LogicException(ExceptionMessages.NOT_FOUND, HttpStatus.NOT_FOUND);
    }
    await this.checkIfAllExist(friendIds);

    this.repository.merge(profile, profileData);

    if (Array.isArray(friendIds)) {
      if (friendIds.includes(id)) {
        throw new LogicException(ExceptionMessages.FRIEND_OWN, HttpStatus.UNPROCESSABLE_ENTITY);
      }
      profile.friends = [];
      await this.repository.save(profile);
      profile.friends = await this.repository.find({ where: { id: In(friendIds) } });
    }

    return this.repository.save(profile);
  }

  async delete(ids: string): Promise<{
    message: Messages;
  }> {
    const profileIds: number[] = ids.split(',').map((id) => Number(id));

    await this.checkIfAllExist(profileIds);
    await this.repository.delete(profileIds);

    return { message: Messages.SUCCESSFUL_OPERATION };
  }

  private async checkIfAllExist(ids: number[] = []): Promise<void> {
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

  private async findOneByOption(
    where: FindOptionsWhere<Profiles>,
    relations: FindOptionsRelations<Profiles> = {},
  ): Promise<Profiles> {
    return this.repository.findOne({
      where,
      relations,
    });
  }
}
