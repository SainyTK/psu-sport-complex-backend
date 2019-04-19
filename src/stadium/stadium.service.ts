import { Injectable, Inject } from '@nestjs/common';
import { Stadium } from './model/stadium.model';

@Injectable()
export class StadiumService {
  constructor(@Inject('stadiumRepo') private readonly stadium: typeof Stadium) {}

  async findAll() {
    return await this.stadium.findAll();
  }

  async findById(stadiumId: number) {
    const stadium = await this.stadium.findById(stadiumId);
    return stadium;
  }

  async insert(stadium: Stadium) {
    return await this.stadium.create(stadium);
  }
}
