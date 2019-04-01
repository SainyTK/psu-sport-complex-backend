import { Injectable, Inject } from '@nestjs/common';
import { Court } from './model/court.model';

@Injectable()
export class CourtService {
  constructor(@Inject('courtRepo') private readonly court: typeof Court) {}

  async insert(court: Court) {
    return await this.court.create(court); 
  }

  async findAll() {
    return await this.court.findAll();
  }
}
