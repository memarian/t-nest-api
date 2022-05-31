import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Query,
  UploadedFile,
  UploadedFiles
} from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { GetUser } from 'src/auth/decorators/get-user.decorator';
import { ApiFile } from './decorators/file.decorator';
import { ApiFileFields } from './decorators/files-field.decorator';
import { CreateLandDto } from './dto/create-land.dto';
import { PaginateDto } from './dto/paginate.dto';
import { UpdateLandDto } from './dto/update-land.dto';
import { LandsService } from './lands.service';

@ApiTags('Terrain')
@Controller('lands')
// @UseGuards(AuthGuard())
export class LandsController {
  constructor(private readonly landsService: LandsService) {}

  @Post()
  async create(@Body() createLandDto: CreateLandDto, @GetUser() user) {
    const land = await this.landsService.create(user?.userId, createLandDto);
    return { id: land.id };
  }

  @Post('upload/:fieldName')
  @ApiFile('file', true)
  async uploadFile(
    @Param('id') landId: number,
    @Param('fieldName') fieldName: string,
    @UploadedFile() file: Express.Multer.File,
  ) {
    const { filename: fileName, originalname: originalName } = file;

    await this.landsService.insertFile({
      fileName,
      originalName,
      fieldName,
      landId,
    });
  }

  // @Post('uploads')
  // uploadFiles(@UploadedFiles() files: Array<Express.Multer.File>) {
  //   console.log(files);
  // }

  @Post('uploadFields/:id')
  @ApiFileFields()
  async uploadFields(
    @Param('id') id: string,
    @UploadedFiles() files: Express.Multer.File[],
  ) {
    await this.landsService.insertFiles(+id, files);
  }

  @Get()
  async findAll(@Query() paginateDto: PaginateDto, @GetUser() user) {
    return await this.landsService.findAll(user, paginateDto);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.landsService.findOne(+id);
  }

  @Post(':id/patch')
  update(@Param('id') id: string, @Body() updateLandDto: UpdateLandDto) {
    return this.landsService.update(+id, updateLandDto);
  }

  @Post(':id')
  @ApiTags('delete')
  @ApiOperation({ description: 'delete record land get by id' })
  delete(@Param('id') id: string) {
    this.landsService.deleteById(+id);
  }
}
