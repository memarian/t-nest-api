import { Controller, Get, Query } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { LangsService } from './langs.service';

@ApiTags('language')
@Controller('langs')
export class LangsController {
  constructor(private readonly langsService: LangsService) {}

  @Get('land/:lang')
  getTranslateLand(@Query() language) {
    console.log(language);

    return this.langsService.findALL();
  }
}
