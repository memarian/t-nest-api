import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/users/entities/user.entity';
import { UsersService } from 'src/users/users.service';
import { Repository } from 'typeorm';
import { CreateLandDto } from './dto/create-land.dto';
import { PaginateDto } from './dto/paginate.dto';
import { UpdateLandDto } from './dto/update-land.dto';
import { UploadFileDto } from './dto/upload-file.dto';
import { AttachFiles } from './entities/attachFiles.entity';
import { Land } from './entities/land.entity';

@Injectable()
export class LandsService {
  constructor(
    @InjectRepository(Land) private readonly landRepository: Repository<Land>,
    @InjectRepository(AttachFiles)
    private readonly landFileRepository: Repository<AttachFiles>,
    @Inject(UsersService)
    private readonly userService: UsersService,
  ) {}

  async update(landId: number, updateLandDto: UpdateLandDto) {
    return await this.landRepository.update(landId, updateLandDto);
  }

  async insertFile(uploadFileDto: UploadFileDto) {
    const { landId } = uploadFileDto;
    const land = await this.findOne(landId);
    if (!land) throw new NotFoundException('id invalid');

    const attachFile = this.landFileRepository.create({
      ...uploadFileDto,
      land,
    });
    await this.landFileRepository.save(attachFile);
  }

  async insertFiles(landId: number, files: Express.Multer.File[]) {
    const land = await this.findOne(landId);
    if (!land) throw new NotFoundException('id invalid');

    const attachFiles: AttachFiles[] = [];

    for (const key in files) {
      const attachFile = this.landFileRepository.create();
      attachFile.fieldName = key;
      attachFile.land = land;

      const file = files[key][0];
      attachFile.fieldName = key;
      attachFile.land;
      // console.log(attachFile);

      attachFiles.push(attachFile);
    }
    // await this.landRepository.save(attachFiles);
  }

  async create(userId = 1, createLandDto: CreateLandDto): Promise<Land> {
    const user = await this.userService.findOne(userId);
    const land = this.landRepository.create(createLandDto);
    land.user = user;
    return await this.landRepository.save(land);
  }

  async findAll(user: User, paginateDto: PaginateDto): Promise<Land[]> {
    // const { skip, take } = paginateDto;
    // return await this.landRepository.find({
    // where: { : 1 },
    //   skip,
    //   take,
    // });
    return await this.landRepository.find();
  }

  async findOne(id: number): Promise<Land> {
    return await this.landRepository.findOne({
      where: {
        id,
      },
    });
  }

  async deleteById(id: number): Promise<any> {
    return await this.landRepository.delete(id);
  }
}
