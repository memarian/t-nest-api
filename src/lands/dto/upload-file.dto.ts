import { IsNumber, IsString } from 'class-validator';

export class UploadFileDto {
  @IsNumber()
  landId: number;

  @IsString()
  fileName: string;

  @IsString()
  originalName: string;

  @IsString()
  fieldName: string;
}
