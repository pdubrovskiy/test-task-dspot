import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsInt, IsOptional, Min } from 'class-validator';

export class PaginationDto {
  @ApiPropertyOptional({
    required: false,
    title: 'perPage',
  })
  @Type(() => Number)
  @IsInt()
  @Min(-1)
  @IsOptional()
  perPage: number = 20;

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
