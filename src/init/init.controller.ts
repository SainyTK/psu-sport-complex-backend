import {
  Controller,
  Get,
  Res,
  HttpStatus
} from '@nestjs/common';
import { InitService } from './init.service';

@Controller('init')
export class InitController {
  constructor(private readonly initService: InitService) { }

  @Get()
  async initializeData(@Res() res) {
    const result = await this.initService.initData();
    return res.status(HttpStatus.OK).json(result);
  }
}
