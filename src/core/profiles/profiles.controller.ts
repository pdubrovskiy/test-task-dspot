import { ShortestPathDto } from './dto/shortest-path.dto';
import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Query,
  HttpStatus,
  Put,
  ParseIntPipe,
} from '@nestjs/common';
import { ProfilesService } from './profiles.service';
import { CreateProfileDto } from './dto/create-profile.dto';
import { ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { ProfilesDto } from './dto/profiles.dto';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { DeleteProfilesDto } from './dto/delete-profiles.dto';
import { ApiResponseWrapper } from 'src/common/decorators/swagger.decorator';
import { GetProfilesDto } from './dto/get-profiles.dto';
import { Profiles } from './profiles.entity';
import { ApiErrorWrapper } from 'src/common/decorators/swagger-error.decorator';
import { Exceptions } from 'src/common/exceptions/exceptions';
import { ExceptionMessages } from 'src/common/exceptions/exception-messages';
import { ApiMessageResponse } from 'src/common/decorators/swagger-message.decorator';
import { Responses } from 'src/common/response_messages/responses';
import { Messages } from 'src/common/response_messages/messages';
import { FindShortestConnection } from './dto/find-shortes-connection.dto';
import { PageData } from 'src/common/pagination/page-data';

@ApiTags('profiles')
@Controller('profiles')
export class ProfilesController {
  constructor(private readonly profilesService: ProfilesService) {}

  @ApiOperation({ summary: 'Get all profiles' })
  @ApiResponseWrapper(
    {
      withMeta: true,
      options: { status: HttpStatus.OK, description: Messages.SUCCESS_MESSAGE },
    },
    ProfilesDto,
  )
  @ApiErrorWrapper(Exceptions[ExceptionMessages.ERROR_RESPONSE])
  @Get()
  getAll(@Query() getProfilesDto: GetProfilesDto): Promise<PageData<Profiles>> {
    return this.profilesService.getAll(getProfilesDto);
  }

  @ApiOperation({ summary: 'Create a new profile' })
  @ApiBody({ type: CreateProfileDto })
  @ApiResponseWrapper(
    { options: { status: HttpStatus.CREATED, description: Messages.SUCCESSFUL_OPERATION } },
    ProfilesDto,
  )
  @ApiResponseWrapper(
    { options: { status: HttpStatus.CREATED, description: Messages.SUCCESSFUL_OPERATION } },
    ProfilesDto,
  )
  @ApiErrorWrapper(Exceptions[ExceptionMessages.UNPROCESSABLE_ENTITY])
  @ApiErrorWrapper(Exceptions[ExceptionMessages.ERROR_RESPONSE])
  @Post()
  create(@Body() createProfileDto: CreateProfileDto): Promise<Profiles> {
    return this.profilesService.create(createProfileDto);
  }

  @ApiOperation({ summary: 'Get a profile by ID' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: Messages.SUCCESS_MESSAGE,
    type: ProfilesDto,
  })
  @ApiErrorWrapper(Exceptions[ExceptionMessages.NOT_FOUND])
  @ApiErrorWrapper(Exceptions[ExceptionMessages.ERROR_RESPONSE])
  @Get(':id')
  getOneById(@Param('id', ParseIntPipe) id: number): Promise<Profiles> {
    return this.profilesService.getOneById(id);
  }

  @ApiOperation({ summary: 'Update profile' })
  @ApiBody({ type: UpdateProfileDto })
  @ApiMessageResponse(Responses[Messages.SUCCESSFUL_OPERATION])
  @ApiErrorWrapper(Exceptions[ExceptionMessages.UNPROCESSABLE_ENTITY])
  @ApiErrorWrapper(Exceptions[ExceptionMessages.ERROR_RESPONSE])
  @Put(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateProfileDto: UpdateProfileDto,
  ): Promise<Profiles> {
    return this.profilesService.update(id, updateProfileDto);
  }

  @ApiOperation({ summary: 'Delete profiles' })
  @ApiBody({ type: DeleteProfilesDto })
  @ApiMessageResponse(Responses[Messages.SUCCESSFUL_OPERATION])
  @ApiErrorWrapper(Exceptions[ExceptionMessages.UNPROCESSABLE_ENTITY])
  @ApiErrorWrapper(Exceptions[ExceptionMessages.ERROR_RESPONSE])
  @Delete()
  delete(@Body() deleteProfilesDto: DeleteProfilesDto): Promise<{
    message: Messages;
  }> {
    return this.profilesService.delete(deleteProfilesDto.ids);
  }

  @ApiOperation({ summary: 'Get all friends by profile ID' })
  @ApiResponseWrapper(
    {
      withMeta: true,
      options: { status: HttpStatus.OK, description: Messages.SUCCESS_MESSAGE },
    },
    ProfilesDto,
  )
  @ApiErrorWrapper(Exceptions[ExceptionMessages.NOT_FOUND])
  @ApiErrorWrapper(Exceptions[ExceptionMessages.ERROR_RESPONSE])
  @Get('/friends/:id')
  getAllFriends(@Param('id', ParseIntPipe) id: number): Promise<Profiles[]> {
    return this.profilesService.getAllFriends(id);
  }

  @ApiOperation({ summary: 'Get shortest connection between friends' })
  @ApiResponseWrapper(
    {
      options: { status: HttpStatus.OK, description: Messages.SUCCESS_MESSAGE },
    },
    ShortestPathDto,
  )
  @ApiErrorWrapper(Exceptions[ExceptionMessages.NOT_FOUND])
  @ApiErrorWrapper(Exceptions[ExceptionMessages.ERROR_RESPONSE])
  @Post('/friends/shortestConnection')
  findShortestConnection(@Body() dto: FindShortestConnection): Promise<number[]> {
    return this.profilesService.findShortestConnection(dto.profileId1, dto.profileId2);
  }
}
