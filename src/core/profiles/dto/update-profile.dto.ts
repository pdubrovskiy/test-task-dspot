import { IsOptional, IsString, IsBoolean, IsInt } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateProfileDto {
  @ApiProperty({ type: String, required: false })
  @IsOptional()
  @IsString()
  img?: string;

  @ApiProperty({ type: String, required: false })
  @IsOptional()
  @IsString()
  firstName?: string;

  @ApiProperty({ type: String, required: false })
  @IsOptional()
  @IsString()
  lastName?: string;

  @ApiProperty({ type: String, required: false })
  @IsOptional()
  @IsString()
  phone?: string;

  @ApiProperty({ type: String, required: false })
  @IsOptional()
  @IsString()
  address?: string;

  @ApiProperty({ type: String, required: false })
  @IsOptional()
  @IsString()
  city?: string;

  @ApiProperty({ type: String, required: false })
  @IsOptional()
  @IsString()
  state?: string;

  @ApiProperty({ type: String, required: false })
  @IsOptional()
  @IsString()
  zipCode?: string;

  @ApiProperty({ type: Boolean, required: false })
  @IsOptional()
  @IsBoolean()
  available?: boolean;

  @ApiProperty({ type: [Number] })
  @IsOptional()
  @IsInt({ each: true })
  friendIds: number[];
}
