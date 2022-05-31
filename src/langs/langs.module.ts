import { Module } from '@nestjs/common';
import { LangsService } from './langs.service';
import { LangsController } from './langs.controller';

@Module({
  controllers: [LangsController],
  providers: [LangsService]
})
export class LangsModule {}
