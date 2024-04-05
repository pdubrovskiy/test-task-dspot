import { Profiles } from '../profiles.entity';

export function generateProfiles(profilesTotal: number): Profiles[] {
  const profiles: Profiles[] = [];

  for (let i = 0; i < profilesTotal; i++) {
    const profile = new Profiles();
    profile.img = `profile_${i}.jpg`;
    profile.firstName = `First_${i}`;
    profile.lastName = `Last_${i}`;
    profile.phone = `123456789${i}`;
    profile.address = `Address_${i}`;
    profile.city = `City_${i}`;
    profile.state = `State_${i}`;
    profile.zipCode = `Zip_${i}`;
    profile.available = Math.random() < 0.5;
    profile.friends = [];

    profiles.push(profile);
  }

  return profiles;
}
