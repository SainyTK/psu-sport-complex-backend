import {
  Controller,
  Get,
  Res,
  Post,
  Body,
  Param,
  HttpStatus,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { TransactionService } from './transaction.service';
import { TransactionDTO } from './dto/transaction.dto';

@Controller('transaction')
export class TransactionController {
  constructor(private readonly transactionService: TransactionService) { }

  @Get()
  async getAllTransaction(@Res() res) {
    const result = await this.transactionService.findAll();
    return res.status(HttpStatus.OK).json(result);
  }

  @Post()
  @UsePipes(new ValidationPipe())
  async createTransaction(@Body() dto: TransactionDTO, @Res() res) {
    console.log(dto);
    await this.transactionService.create(TransactionDTO.toModel(dto));
    return res.status(HttpStatus.OK).send('SUCCEED');
  }

}
