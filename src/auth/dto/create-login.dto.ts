import { IsNumber, IsPhoneNumber, MaxLength } from 'class-validator';

export class CreateLoginDto {
  @IsPhoneNumber('IR')
  @MaxLength(12)
  phone: string;

  @IsNumber()
  code: number;
}
