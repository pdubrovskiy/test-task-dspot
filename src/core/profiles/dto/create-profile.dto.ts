import { IsString, IsBoolean, IsInt } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateProfileDto {
  @ApiProperty({ type: String })
  @IsString()
  img: string;

  @ApiProperty({ type: String })
  @IsString()
  firstName: string;

  @ApiProperty({ type: String })
  @IsString()
  lastName: string;

  @ApiProperty({ type: String })
  @IsString()
  phone: string;

  @ApiProperty({ type: String })
  @IsString()
  address: string;

  @ApiProperty({ type: String })
  @IsString()
  city: string;

  @ApiProperty({ type: String })
  @IsString()
  state: string;

  @ApiProperty({ type: String })
  @IsString()
  zipCode: string;

  @ApiProperty({ type: Boolean })
  @IsBoolean()
  available: boolean;

  @ApiProperty({ type: [Number] })
  @IsInt({ each: true })
  friendIds: number[];
}
