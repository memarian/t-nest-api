import { IsNumberString, MaxLength, MinLength } from 'class-validator';

export class SignInDto {
  @IsNumberString()
  @MaxLength(10)
  @MinLength(10)
  nationalCode: string;
}
