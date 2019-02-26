import { Injectable, Inject } from '@nestjs/common';
import { Court } from './model/court.model';

@Injectable()
export class CourtService {
  constructor(@Inject('courtRepo') private readonly court: typeof Court) {}

  async findAll() {
    return await this.court.findAll();
  }
}
