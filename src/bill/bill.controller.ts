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
  Post,
  UseInterceptors,
  UploadedFile,
} from '@nestjs/common';
import { BillService } from './bill.service';
import { AuthGuard } from '@nestjs/passport';
import { AuthService } from '../authen/auth.service';
import { extractToken } from '../common/utils/extract-token';
import { FileInterceptor } from '@nestjs/platform-express';
import multerConfig from '../config/multer.config';

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

  @UseGuards(AuthGuard())
  @Get('/my/last')
  async getMyLastBill(@Req() req, @Res() res) {
    const user = await this.authService.validateToken(extractToken(req));
    if (user.error)
      return res.status(HttpStatus.OK).json(user);

    const bill = await this.billService.getMyLastBill(user.userId);
    if (!bill)
      return res.status(HttpStatus.OK).json({ error: 'bill not found' });
    return res.status(HttpStatus.OK).json(bill);
  }

  @Patch('/confirm/:billId')
  @UsePipes(new ValidationPipe())
  async confirm(@Param('billId') billId: number, @Body('slipUrl') slipUrl: string, @Res() res) {
    const result = await this.billService.confirm(billId, slipUrl);
    return res.status(HttpStatus.OK).json(result);
  }

  @Patch('/approve/:billId')
  @UsePipes(new ValidationPipe())
  async approve(@Param('billId') billId: number, @Res() res) {
    const result = await this.billService.approve(billId);
    return res.status(HttpStatus.OK).json(result);
  }

  @Post('/upload')
  @UseInterceptors(FileInterceptor('file', multerConfig))
  async uploadImage(@UploadedFile() file) {
    return file;
  }

  @Get('/image/:filename')
  async getImage(@Res() res, @Param('filename') filename) {
    if (!filename)
      return '';
    return res.sendFile(filename, { root: 'uploads' });
  }

}
