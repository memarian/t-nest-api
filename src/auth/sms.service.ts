import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { SmsLog } from './entities/smsLog.dto';

@Injectable()
export class SmsService {
  constructor(
    @InjectRepository(SmsLog)
    private readonly smsLogRepository: Repository<SmsLog>,
  ) {}

  async logging(data: any) {
    const smslog = this.smsLogRepository.create(data);
    await this.smsLogRepository.save(smslog);
  }
}
