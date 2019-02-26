import {
  Controller,
  Get,
  Res,
} from '@nestjs/common';
import { CourtService } from './court.service';

@Controller('court')
export class CourtController {
  constructor(private readonly courtService: CourtService) { }

  @Get()
  async findAll(@Res() res) {
    const courts = await this.courtService.findAll();
    return res.json({courts});
  }
}
