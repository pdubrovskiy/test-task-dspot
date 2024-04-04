import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsInt, IsOptional, Min } from 'class-validator';

export class PaginationDto {
  @ApiPropertyOptional({
    required: false,
    title: 'per_page',
  })
  @Type(() => Number)
  @IsInt()
  @Min(-1)
  @IsOptional()
  per_page: number = 20;

  @ApiPropertyOptional({
    required: false,
    title: 'page',
  })
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @IsOptional()
  page: number = 1;
}
