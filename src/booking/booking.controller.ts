import {
  Controller,
  Get,
  Post,
  Res,
  Body,
  UsePipes,
  UseGuards,
  Param,
  ParseIntPipe,
  Patch,
  Req,
  UseInterceptors,
  FileInterceptor,
  UploadedFile,
} from '@nestjs/common';
import { BookingService } from './booking.service';
import { BookingDTO } from './dto/booking.dto';
import { ValidationPipe } from 'src/common/validation.pipe';
import { AuthGuard } from '@nestjs/passport';
import { extractToken } from 'src/common/utils/extract-token';
import { AuthService } from 'src/authen/auth.service';

@Controller('booking')
export class BookingController {
  constructor(
    private readonly bookingService: BookingService,
    private readonly authService: AuthService
  ) { }

  @UseGuards(AuthGuard())
  @Get('/all')
  async findAll(@Res() res) {
    const result = await this.bookingService.findAll();
    return res.json(result);
  }

  @UseGuards(AuthGuard())
  @UsePipes(new ParseIntPipe())
  @Get('/id/:bookingId')
  async findById(@Res() res, @Param('bookingId') id) {
    const result = await this.bookingService.findById(id);
    return res.json(result);
  }

  @UseGuards(AuthGuard())
  @UsePipes(new ParseIntPipe())
  @Get('/user/:userId')
  async findByUserId(@Res() res, @Param('userId') userId) {
    const result = await this.bookingService.findByUserId(userId);
    return res.json(result);
  }

  @UseGuards(AuthGuard())
  @Get('/')
  async findCurrentWeek(@Res() res) {
    const result = await this.bookingService.findCurrentWeek();
    return res.json(result);
  }

  @UseGuards(AuthGuard())
  @UsePipes(new ValidationPipe())
  @Post()
  async book(@Body() dto: BookingDTO, @Res() res) {
    const result = await this.bookingService.book(BookingDTO.toModel(dto));
    return res.json(result);
  }

  @UseGuards(AuthGuard())
  @UsePipes(new ValidationPipe())
  @Patch('/approve/:bookingId')
  async approve(@Param('bookingId') bookingId, @Req() req, @Res() res) {
    await this.authService.checkAdminFromToken(extractToken(req));

    const result = await this.bookingService.approve(bookingId, true);
    return res.json(result);
  }

  @UseGuards(AuthGuard())
  @UsePipes(new ValidationPipe())
  @Patch('/unapprove/:bookingId')
  async unApprove(@Param('bookingId') bookingId, @Req() req, @Res() res) {
    await this.authService.checkAdminFromToken(extractToken(req));

    const result = await this.bookingService.approve(bookingId, false);
    return res.json(result);
  }

  // @UseGuards(AuthGuard())
  @UseInterceptors(FileInterceptor('file'))
  @Post('/upload_slip/:bookingId')
  async uploadSlip(@UploadedFile() slip, @Param('bookingId') bookingId, @Res() res) {
    console.log(slip);
    const result = await this.bookingService.uploadSlip(bookingId, slip.filename);
    return res.json(result);
  }

  @Get('/slip/:bookingId')
  async getSlip(@Param('bookingId') path, @Res() res) {
    let response = {};
    try {
      response = res.sendFile(path, { root: 'uploads' });
    } catch (e) {
      response = 'error'
    }
    return response;
  }
}
