import { Body, Controller, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { SignInDto } from './dto/signIn.dto';
import { VerifyTokenDto } from './dto/verifyLogin.dto';

@ApiTags('Authentication')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('signin')
  async signIn(@Body() signInDto: SignInDto) {
    return await this.authService.create(signInDto);
  }

  @Post('verify')
  async verifyCode(@Body() verifyToken: VerifyTokenDto) {
    return await this.authService.verifyCode(verifyToken);
  }
}
