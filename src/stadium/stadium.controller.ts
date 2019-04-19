import {
  Controller,
  Get,
  Res,
  Post,
  Body,
  Param,
} from '@nestjs/common';
import { StadiumService } from './stadium.service';

@Controller('stadium')
export class StadiumController {
  constructor(private readonly stadiumService: StadiumService) { }

  @Get('/all')
  async findAll(@Res() res) {
    const stadiums = await this.stadiumService.findAll();
    return res.json(stadiums);
  }

  @Get('/:stadiumId')
  async findById(@Param('stadiumId') id,@Res() res) {
    const stadium = await this.stadiumService.findById(id);
    return res.json(stadium);
  }

  @Post()
  async insert(@Body() data, @Res() res) {
    const stadium = await this.stadiumService.insert(data);
    return res.json(stadium);
  }

}
