import {
  Controller,
  Get,
  Res,
  Param,
  HttpStatus,
  Body,
  Patch,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { BillService } from './bill.service';
import { TransactionDTO } from '../transaction/dto/transaction.dto';

@Controller('bill')
export class BillController {
  constructor(
    private readonly billService: BillService
  ) { }

  @Get()
  async getAll(@Res() res) {
    const result = await this.billService.findAll();
    return res.status(HttpStatus.OK).json(result);
  }

  @Patch('/confirm/:billId')
  @UsePipes(new ValidationPipe())
  async confirm(@Param('billId') billId: number,@Body() dto: TransactionDTO, @Res() res) {
    const result = await this.billService.confirm(billId, TransactionDTO.toModel(dto));
    return res.status(HttpStatus.OK).json(result);
  }

}
