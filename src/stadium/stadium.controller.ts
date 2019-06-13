import {
  Controller,
  Get,
  Res,
  Post,
  Body,
  Param,
  Patch,
  Delete,
} from '@nestjs/common';
import { StadiumService } from './stadium.service';
import { StadiumDTO } from './dto/stadium.dto';

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
  async insert(@Body() data: StadiumDTO, @Res() res) {
    const stadium = await this.stadiumService.insert(StadiumDTO.toModel(data));
    return res.json(stadium);
  }

  @Patch('/:stadiumId')
  async update(@Param('stadiumId') stadiumId, @Body() data: StadiumDTO, @Res() res) {
    const stadium = await this.stadiumService.update(stadiumId, StadiumDTO.toModel(data));
    return res.json(stadium);
  }

  @Delete('/:stadiumId')
  async delete(@Param('stadiumId') stadiumId, @Res() res) {
    const stadium = await this.stadiumService.delete(stadiumId);
    return res.json(stadium);
  }

}
