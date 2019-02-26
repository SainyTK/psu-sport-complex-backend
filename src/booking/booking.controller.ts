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
  UnauthorizedException,
} from '@nestjs/common';
import { BookingService } from './booking.service';
import { BookingDTO } from './dto/booking.dto';
import { ValidationPipe } from 'src/common/validation.pipe';
import { AuthGuard } from '@nestjs/passport';
import { extractToken } from 'src/common/utils/extract-token';
import { AuthService } from 'src/authen/auth.service';
import { USER_POSITION } from 'src/user/constant/user-position';

@Controller('booking')
export class BookingController {
  constructor(
    private readonly bookingService: BookingService,
    private readonly authService: AuthService
    ) { }

  @Get('/all')
  async findAll(@Res() res) {
    const bookings = await this.bookingService.findAll();
    return res.json({bookings});
  }

  @Get('/user/:userId')
  @UsePipes(new ParseIntPipe())
  async findByUserId(@Res() res, @Param('userId') userId) {
    const bookings = await this.bookingService.findByUserId(userId);
    return res.json({bookings});
  }

  @UseGuards(AuthGuard())
  @Get('/')
  async findCurrentWeek(@Res() res) {
    const currentWeekBookings = await this.bookingService.findCurrentWeek();
    return res.json({currentWeekBookings});
  }

  @UseGuards(AuthGuard())
  @UsePipes(new ValidationPipe())
  @Post()
  async book(@Body() dto:BookingDTO, @Res() res) {
    const result = await this.bookingService.book(BookingDTO.toModel(dto));
    return res.json({result});
  }

  @UseGuards(AuthGuard())
  @UsePipes(new ValidationPipe())
  @Patch('/upload_slip/:bookingId')
  async uploadSlip(@Body('slip') slip,@Param('bookingId') bookingId,@Res() res) {
    const result = await this.bookingService.uploadSlip(bookingId, slip);
    return res.json({result});
  }

  @UseGuards(AuthGuard())
  @UsePipes(new ValidationPipe())
  @Patch('/approve/:bookingId')
  async approve(@Param('bookingId') bookingId,@Req() req, @Res() res) {
    await this.authService.checkAdminFromToken(extractToken(req));

    const result = await this.bookingService.approve(bookingId, true);
    return res.json({result});
  }

  @UseGuards(AuthGuard())
  @UsePipes(new ValidationPipe())
  @Patch('/unapprove/:bookingId')
  async unApprove(@Param('bookingId') bookingId,@Req() req, @Res() res) {
    await this.authService.checkAdminFromToken(extractToken(req));

    const result = await this.bookingService.approve(bookingId, false);
    return res.json({result});
  }
}
