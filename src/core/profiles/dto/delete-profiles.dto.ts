import { IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class DeleteProfilesDto {
  @ApiProperty({ example: '1,2,3' })
  @IsNotEmpty()
  @IsString()
  ids: string;
}
