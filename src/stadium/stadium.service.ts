import { Injectable, Inject } from '@nestjs/common';
import { Stadium } from './model/stadium.model';
import { Result } from 'src/result/result';
import { CreateStadiumDTO } from './dto/create-stadium.dto';

@Injectable()
export class StadiumService {
  private result: Result;

  constructor(@Inject('stadiumRepo') private readonly stadium: typeof Stadium) {
    this.result = new Result('Stadium');
  }

  async createStadium(data: CreateStadiumDTO) {
    let stadium = await this.stadium.findOne({where: {stadiumName: data.stadiumName}});
    if (stadium) {
      return this.result.exist({stadium});
    }
    stadium = await this.stadium.create(data);
    return this.result.success('Create', stadium);
  }

  async findStadiumById(id: number) {
    if (isNaN(id))
      return this.result.badRequest();
    const stadium = await this.stadium.findByPk(id);
    if (stadium) {
      return this.result.found(stadium);
    }
    return this.result.notFound();
  }
}
