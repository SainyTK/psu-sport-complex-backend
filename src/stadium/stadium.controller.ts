import {
  Controller,
  Get,
  Post,
  Res,
  Body,
  Param,
  UsePipes,
  ParseIntPipe,
} from '@nestjs/common';
import { StadiumService } from './stadium.service';
import { CreateStadiumDTO } from './dto/create-stadium.dto';
import { ValidationPipe } from 'src/common/validation.pipe';

@Controller('stadium')
export class StadiumController {
  constructor(private readonly stadiumService: StadiumService) { }

  @Get(':id')
  async getStadiumById(@Param('id', new ParseIntPipe()) id: number, @Res() res) {
    const result = await this.stadiumService.findStadiumById(id);
    return res.status(result.status).json(result.response);
  }

  @Post('/create')
  @UsePipes(new ValidationPipe())
  async createStadium(@Body() dto: CreateStadiumDTO, @Res() res) {
    const result = await this.stadiumService.createStadium(dto);
    return res.status(result.status).json(result.response);
  }

}
