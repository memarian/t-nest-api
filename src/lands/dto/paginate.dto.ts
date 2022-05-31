import { Type } from 'class-transformer';
import { IsOptional, IsPositive } from 'class-validator';

export class PaginateDto {
  @Type(() => Number)
  @IsPositive()
  @IsOptional()
  skip: number;

  @Type(() => Number)
  @IsPositive()
  @IsOptional()
  take = 10;
}
