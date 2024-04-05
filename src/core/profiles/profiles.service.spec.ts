import { Test } from '@nestjs/testing';
import { ProfilesService } from './profiles.service';
import { ProfilesRepository } from './profiles.repository';
import { PageData } from 'src/common/pagination/page-data';
import { GetProfilesDto } from './dto/get-profiles.dto';
import { Profiles } from './profiles.entity';
import { generateProfiles } from './utils/profiles.generator';

describe('ProfilesService', () => {
  let profilesService: ProfilesService;
  let profilesRepository: ProfilesRepository;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [
        ProfilesService,
        {
          provide: ProfilesRepository,
          useValue: {
            getAll: jest.fn(),
            create: jest.fn(),
            findOneByOptions: jest.fn(),
            update: jest.fn(),
            checkIfAllExist: jest.fn(),
            delete: jest.fn(),
          },
        },
      ],
    }).compile();

    profilesService = moduleRef.get<ProfilesService>(ProfilesService);
    profilesRepository = moduleRef.get<ProfilesRepository>(ProfilesRepository);
  });

  describe('getAll', () => {
    it('should return a page of profiles', async () => {
      const getProfilesDto: GetProfilesDto = { perPage: -1, page: 1 };
      const profilesTotal = Number(process.env.PROFILES_TOTAL);
      const profiles = generateProfiles(profilesTotal);

      const expectedResult: PageData<Profiles> = { meta: {}, content: profiles };

      jest.spyOn(profilesRepository, 'getAll').mockResolvedValue(expectedResult);
      const result = await profilesService.getAll(getProfilesDto);
      expect(result).toEqual(expectedResult);
    });
  });
});
