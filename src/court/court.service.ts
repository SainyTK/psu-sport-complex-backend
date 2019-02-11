import { Injectable, Inject } from '@nestjs/common';
import { Court } from './model/court.model';
import { Result } from 'src/common/result';

@Injectable()
export class CourtService {
  private result: Result;

  constructor(@Inject('courtRepo') private readonly court: typeof Court) {
    this.result = new Result('Court');
  }

  async findAll() {
    const courts = await this.court.findAll();
    return this.result.success(courts);
  }
}
