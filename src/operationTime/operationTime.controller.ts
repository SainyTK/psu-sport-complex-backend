import {
  Controller,
  Get,
  Res,
  HttpStatus,
  Post,
  Body,
  UsePipes,
} from '@nestjs/common';
import { OperationTimeService } from './operationTime.service';
import { BlackoutDTO } from './dto/blackout.dto';
import { ValidationPipe } from '../common/validation.pipe';

@Controller('operationTime')
export class OperationTimeController {
  constructor(
    private readonly operationTimeService: OperationTimeService,
  ) { }

  @Get()
  async getOperationTime(@Res() res) {
    const result = await this.operationTimeService.getOperationTimes();
    return res.status(HttpStatus.OK).json(result);
  }

  @Post()
  async setOperationTime(@Body() data, @Res() res) {
    const result = await this.operationTimeService.setOperationTimes(data);
    return res.status(HttpStatus.OK).json(result);
  }

  @Get('/blackout')
  async getBlackout(@Res() res) {
    const result = await this.operationTimeService.findAllBlackout();
    return res.status(HttpStatus.OK).json(result);
  }

  @Post('/blackout')
  @UsePipes(new ValidationPipe())
  async createBlackout(@Body() dto:BlackoutDTO, @Res() res) {
    const result = await this.operationTimeService.createBlackout(BlackoutDTO.toModel(dto));
    return res.status(HttpStatus.OK).json(result);
  }

}
