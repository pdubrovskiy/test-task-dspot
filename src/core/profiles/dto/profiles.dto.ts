import { IsNumber, IsString, IsBoolean } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class ProfilesDto {
  @ApiProperty({ example: 6 })
  @IsNumber()
  id: number;

  @ApiProperty({
    example:
      'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500',
  })
  @IsString()
  img: string;

  @ApiProperty({ example: 'Steph' })
  @IsString()
  firstName: string;

  @ApiProperty({ example: 'Walters' })
  @IsString()
  lastName: string;

  @ApiProperty({ example: '(820) 289-1818' })
  @IsString()
  phone: string;

  @ApiProperty({ example: '5190 Center Court Drive' })
  @IsString()
  address: string;

  @ApiProperty({ example: 'Spring' })
  @IsString()
  city: string;

  @ApiProperty({ example: 'TX' })
  @IsString()
  state: string;

  @ApiProperty({ example: '77370' })
  @IsString()
  zipCode: string;

  @ApiProperty({ type: Boolean })
  @IsBoolean()
  available: boolean;

  @ApiProperty({ default: [] })
  friends: ProfilesDto[];
}
