import { IsJWT, IsString } from 'class-validator';

export class VerifyTokenDto {
  @IsJWT()
  loginToken: string;

  @IsString()
  code: string;
}
