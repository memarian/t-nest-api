import { HttpService } from '@nestjs/axios';
import {
  BadRequestException,
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
  NotFoundException
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import axios from 'axios';
import { generateIntCode, isNationalCode } from 'src/common/utils';
import { User } from 'src/users/entities/user.entity';
import { UsersService } from 'src/users/users.service';
import { Repository } from 'typeorm';
import { CreateLoginDto } from './dto/create-login.dto';
import { SignInDto } from './dto/signIn.dto';
import { VerifyTokenDto } from './dto/verifyLogin.dto';
import { LoginUser } from './entities/loginCode.dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(LoginUser)
    private readonly loginUserRepository: Repository<LoginUser>,
    private readonly jwtService: JwtService,
    private readonly httpService: HttpService,
  ) {}

  @Inject(UsersService)
  private readonly userService: UsersService;

  private async register(createLoginUser: CreateLoginDto): Promise<LoginUser> {
    const loginUser = this.loginUserRepository.create(createLoginUser);
    return await this.loginUserRepository.save(loginUser);
  }

  validate(token: string): any {
    return this.jwtService.verify(token);
  }

  /**
   *
   * @param signInDto
   * @returns  token
   * @description generate  user login  and return token
   */
  async create(
    signInDto: SignInDto,
  ): Promise<{ loginToken: string; phone: string }> {
    const user = await this.verifyNationalCode(signInDto.nationalCode);
    let loginUser = await this.getLoginUser(user.phone);

    // if (this.inTime(loginUser.updatedAt, 5 * 60 * 1000)) {
    //   throw new HttpException(
    //     `sms sent ,try at ${getIntervalTime(loginUser.updatedAt, 5)}`,
    //     HttpStatus.TOO_MANY_REQUESTS,
    //   );
    // }

    loginUser.code = this.generateSmsCode();
    loginUser.total = 0;
    loginUser.updatedAt = new Date();
    loginUser.token = this.jwtService.sign(
      {},
      { secret: loginUser.code.toString() },
    );

    loginUser = await this.loginUserRepository.save(loginUser);

    const smsResult = await this.sendSMS(loginUser.phone, loginUser.code);

    // if (!smsResult?.data) {
    //   throw new HttpException(
    //     'sms sent failed',
    //     HttpStatus.INTERNAL_SERVER_ERROR,
    //   );
    // }
    return {
      loginToken: loginUser.token,
      phone: this.generateMaskPhone(loginUser.phone),
    };
  }
  private async getSmsToken() {
    return await axios.post('http://RestfulSms.com/api/Token', {
      UserApiKey: process.env.SMS_USER_KEY,
      SecretKey: process.env.SMS_SECRET_KEY,
    });
  }

  private generateMaskPhone(phone: string): string {
    return phone.substring(0, 6) + '****' + phone.substring(9, 12);
  }

  private async sendSMS(phone: string, code: number) {
    const TokenKey = await (await this.getSmsToken()).data.TokenKey;

    const result = await axios.post(
      process.env.PANEL_S_URI,
      {
        ParameterArray: [
          {
            Parameter: 'code',
            ParameterValue: code,
          },
          {
            Parameter: 'name',
            ParameterValue: 'code ورود شما',
          },
        ],
        Mobile: phone,
        TemplateId: '5648',
      },
      {
        headers: {
          'x-sms-ir-secure-token': TokenKey,
        },
      },
    );
  }
  async verifyCode(
    verifyToken: VerifyTokenDto,
  ): Promise<{ accessToken: string }> {
    const { loginToken, code } = verifyToken;

    const loginUser = await this.findLoginUserByToken(loginToken);

    try {
      this.jwtService.verify(loginToken, {
        secret: code,
      });
    } catch (error) {
      throw new HttpException('invalid credential', HttpStatus.FORBIDDEN);
    }

    const { id, role } = await this.userService.findOneByPhone(loginUser.phone);

    return await this.generateToken({ id, role });
  }

  async findLoginUserByToken(loginToken: string) {
    return await this.loginUserRepository.findOneBy({ token: loginToken });
  }

  private async createLoginUser(
    phone: string,
    code: number,
  ): Promise<LoginUser> {
    const token = this.jwtService.sign(
      { userId: null },
      { secret: code.toString() },
    );

    let result = this.loginUserRepository.create({
      phone,
      code,
      token,
    });

    result = await this.loginUserRepository.save(result);
    return result;
  }

  async findOneByNationalCode(nationalCode: string): Promise<User> {
    const user = await this.userService.findOneByNationalCode(nationalCode);
    if (!user) throw new NotFoundException(`invalid ${nationalCode}`);
    return user;
  }

  private async generateToken(payload: any): Promise<{ accessToken: string }> {
    this.jwtService;
    const accessToken: string = await this.jwtService.signAsync(
      { userId: payload.id, role: payload.role },
      {},
    );
    return { accessToken };
  }

  private async verifyToken(token: string) {
    const result = this.jwtService.verifyAsync(token);
    console.log(result);
  }

  /**
   * @param phone
   * @returns LoginUser
   * @description find user on loginUser if not found create new one
   * @private
   */
  private async getLoginUser(phone: string): Promise<LoginUser> {
    let loginUser = await this.loginUserRepository.findOneBy({ phone });

    if (!loginUser) {
      const code = this.generateSmsCode();
      console.log('create new login User, code: ', code);
      loginUser = await this.createLoginUser(phone, code);
    }

    return loginUser;
  }

  private generateSmsCode(): number {
    return generateIntCode();
  }

  private async verifyNationalCode(nationalCode: string): Promise<User> {
    if (!isNationalCode(nationalCode))
      throw new BadRequestException('invalid nationalcode');

    return await this.findOneByNationalCode(nationalCode);
  }

  /**
   *
   * @param createdTime  date value
   * @param delay get number as period time
   * @returns boolean
   * @description check whether time is expire or not
   */
  private inTime(date: Date, delay: number): boolean {
    const expireDate = new Date(date).getTime() + delay;
    return new Date().getTime() < expireDate;
  }

  async delete(id: string) {
    this.loginUserRepository.delete(id);
  }
}
