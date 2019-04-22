import {
  Controller,
  Get,
  Post,
  Res,
  Param,
  UseInterceptors,
  FileInterceptor,
  UploadedFile,
  HttpStatus,
} from '@nestjs/common';
import { BillService } from './bill.service';
import MulterConfigService from '../config/multerconfig.service';

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

  @UseInterceptors(FileInterceptor('file'), MulterConfigService)
  @Post('/upload_slip/:billId')
  async uploadSlip(@UploadedFile() slip, @Param('billId') billId, @Res() res) {
    const result = await this.billService.updateSlip(billId, slip.filename);
    return res.status(HttpStatus.OK).json(result);
  }

  @Get('/slip/:billId')
  async getSlip(@Param('billId') path, @Res() res) {
    let response = {};
    try {
      response = res.sendFile(path, { root: 'uploads' });
    } catch (e) {
      response = 'error'
    }
    return response;
  }

  @UseInterceptors(FileInterceptor('file'))
  @Post('/upload')
  async testUpload(@UploadedFile() f, @Res() res) {
    console.log(f.filename);
    return res.status(HttpStatus.OK).json({message: 'OK'})
  }

}
