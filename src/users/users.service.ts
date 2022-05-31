import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
  ) {}

  async findOneByPhone(phone: string): Promise<User> {
    return await this.userRepository.findOneBy({ phone });
  }
  async findOneByNationalCode(nationalCode: string): Promise<User> {
    return await this.userRepository.findOneBy({ nationalCode });
  }

  async findOne(id: number): Promise<User> {
    return await this.userRepository.findOne({ where: { id: id } });
  }
}
