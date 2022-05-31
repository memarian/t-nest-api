import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { MulterModule } from '@nestjs/platform-express';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModule } from 'src/users/users.module';
import { AttachFiles } from './entities/attachFiles.entity';
import { Land } from './entities/land.entity';
import { LandsController } from './lands.controller';
import { LandsService } from './lands.service';

@Module({
  imports: [
    UsersModule,
    PassportModule.register({ defaultStrategy: 'jwt' }),
    TypeOrmModule.forFeature([Land, AttachFiles]),
    MulterModule.register({ dest: './client' }),
  ],
  controllers: [LandsController],
  providers: [LandsService],
})
export class LandsModule {}
