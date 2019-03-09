import {
  Controller,
  Get,
  Res,
  Post,
  Body,
} from '@nestjs/common';
import { StadiumService } from './stadium.service';

@Controller('stadium')
export class StadiumController {
  constructor(private readonly stadiumService: StadiumService) { }

  @Get()
  async findAll(@Res() res) {
    const stadiums = await this.stadiumService.findAll();
    return res.json(stadiums);
  }

  @Post()
  async insert(@Body() data, @Res() res) {
    const stadium = await this.stadiumService.insert(data);
    return res.json(stadium);
  }

}
