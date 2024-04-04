import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Profiles } from 'src/core/profiles/profiles.entity';
import { Repository } from 'typeorm';

@Injectable()
export class SeederService {
  constructor(
    @InjectRepository(Profiles)
    private repository: Repository<Profiles>,
  ) {}

  async seed(profilesTotal: number, friendsTotal: number) {
    const profiles = [];

    for (let i = 0; i < profilesTotal; i++) {
      const profile = this.repository.create({
        img: `profile_${i}.jpg`,
        firstName: `First_${i}`,
        lastName: `Last_${i}`,
        phone: `123456789${i}`,
        address: `Address_${i}`,
        city: `City_${i}`,
        state: `State_${i}`,
        zipCode: `Zip_${i}`,
        available: Math.random() < 0.5,
        friends: [],
      });
      profiles.push(profile);
    }
    await this.repository.insert(profiles);

    for (const profile of profiles) {
      const friends = [...profiles];
      friends.splice(friends.indexOf(profile), 1);
      profile.friends = friends.sort(() => 0.5 - Math.random()).slice(0, friendsTotal);
    }
    await this.repository.save(profiles);
  }
}
