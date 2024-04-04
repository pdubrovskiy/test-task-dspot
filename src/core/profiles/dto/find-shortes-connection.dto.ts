import { IsNumber, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class FindShortestConnection {
  @ApiProperty({ example: 1 })
  @IsNotEmpty()
  @IsNumber()
  profileId1: number;

  @ApiProperty({ example: 2 })
  @IsNotEmpty()
  @IsNumber()
  profileId2: number;
}
