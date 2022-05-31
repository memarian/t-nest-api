import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { ThrottlerModule } from '@nestjs/throttler';
import { TypeOrmModule } from '@nestjs/typeorm';
import * as Joi from 'joi';
import { UsersModule } from 'src/users/users.module';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { LoginUser } from './entities/loginCode.dto';
import { SmsLog } from './entities/smsLog.dto';
import { JwtStartegy } from './jwt.strategy';

@Module({
  imports: [
    TypeOrmModule.forFeature([LoginUser, SmsLog]),
    UsersModule,
    HttpModule,
    ConfigModule.forRoot({
      validationSchema: Joi.object({
        JWT_KEY: Joi.required(),
        JWT_EXPIRE: Joi.required(),
      }),
    }),
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.register({
      secret: process.env.JWT_KEY,
      signOptions: { expiresIn: process.env.JWT_EXPIRE },
    }),
    ThrottlerModule.forRoot({ ttl: 3600, limit: 2 }),
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtStartegy],
  exports: [JwtStartegy, PassportModule],
})
export class AuthModule {}
