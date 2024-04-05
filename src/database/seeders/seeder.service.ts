import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Profiles } from 'src/core/profiles/profiles.entity';
import { generateProfiles } from 'src/core/profiles/utils/profiles.generator';
import { Repository } from 'typeorm';

@Injectable()
export class SeederService {
  constructor(
    @InjectRepository(Profiles)
    private repository: Repository<Profiles>,
  ) {}

  async seed(profilesTotal: number, friendsTotal: number): Promise<void> {
    const profiles: Profiles[] = generateProfiles(profilesTotal);

    await this.repository.insert(profiles);

    for (const profile of profiles) {
      const friends = [...profiles];
      friends.splice(friends.indexOf(profile), 1);
      profile.friends = friends.sort(() => 0.5 - Math.random()).slice(0, friendsTotal);
    }
    await this.repository.save(profiles);
  }
}
