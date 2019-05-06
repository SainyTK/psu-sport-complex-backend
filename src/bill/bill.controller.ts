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
  Req,
  UseGuards,
} from '@nestjs/common';
import { BillService } from './bill.service';
import { ConfirmBillDTO } from './dto/confirm_bill.dto';
import { AuthGuard } from '@nestjs/passport';
import { AuthService } from '../authen/auth.service';
import { extractToken } from '../common/utils/extract-token';

@Controller('bill')
export class BillController {
  constructor(
    private readonly billService: BillService,
    private readonly authService: AuthService
  ) { }

  @Get()
  async getAll(@Res() res) {
    const result = await this.billService.findAll();
    return res.status(HttpStatus.OK).json(result);
  }

  @UseGuards(AuthGuard())
  @Get('/my')
  async getMyBills(@Req() req, @Res() res) {
    const user = await this.authService.validateToken(extractToken(req));
    if (user.error)
      return res.status(HttpStatus.OK).json(user);

    const bills = await this.billService.findByUserId(user.userId);
    return res.status(HttpStatus.OK).json(bills);
  }

  @Patch('/confirm/:billId')
  @UsePipes(new ValidationPipe())
  async confirm(@Param('billId') billId: number,@Body() dto: ConfirmBillDTO, @Res() res) {
    const result = await this.billService.confirm(billId, ConfirmBillDTO.toTransactionModel(dto));
    return res.status(HttpStatus.OK).json(result);
  }

}
