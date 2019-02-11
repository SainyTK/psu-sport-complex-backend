import {
  Controller,
  Get,
  Res,
} from '@nestjs/common';
import { StadiumService } from './stadium.service';

@Controller('stadium')
export class StadiumController {
  constructor(private readonly stadiumService: StadiumService) { }

  @Get()
  async findAll(@Res() res) {
    const result = await this.stadiumService.findAll();
    return res.status(result.status).json(result.response);
  }

}
