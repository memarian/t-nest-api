import { IsOptional, IsString } from 'class-validator';

export class CreateLandDto {
  @IsString()
  @IsOptional()
  location: string;

  @IsString()
  @IsOptional()
  city: string;

  @IsString()
  @IsOptional()
  province: string;

  @IsString()
  @IsOptional()
  owner: string;

  @IsOptional()
  @IsString()
  requestOwner: string;

  @IsOptional()
  @IsString()
  status: string;

  @IsOptional()
  @IsString()
  documentStatus: string;

  @IsString()
  @IsOptional()
  area: string;

  @IsOptional()
  @IsString()
  contractorUnitCommitted: string;
}
