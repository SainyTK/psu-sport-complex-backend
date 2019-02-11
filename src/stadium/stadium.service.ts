import { Injectable, Inject } from '@nestjs/common';
import { Stadium } from './model/stadium.model';
import { Result } from 'src/common/result';

@Injectable()
export class StadiumService {
  private result: Result;

  constructor(@Inject('stadiumRepo') private readonly stadium: typeof Stadium) {
    this.result = new Result('Stadium');
  }

  async findAll() {
    const stadiums = await this.stadium.findAll();
    return this.result.found(stadiums);
  }
}
