import { ApiProperty } from '@nestjs/swagger';
import { IsInt } from 'class-validator';

export class ShortestPathDto {
  @ApiProperty({ type: [Number], example: [1, 2, 3] })
  @IsInt({ each: true })
  path: number[];
}
