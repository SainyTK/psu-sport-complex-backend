import {
  Controller,
  Get,
  Post,
  Res,
  Body,
  UsePipes,
  UseGuards,
} from '@nestjs/common';
import { BookingService } from './booking.service';
import { BookingDTO } from './dto/booking.dto';
import { ValidationPipe } from 'src/common/validation.pipe';
import { AuthGuard } from '@nestjs/passport';

@Controller('booking')
export class BookingController {
  constructor(private readonly bookingService: BookingService) { }

  @Get('/all')
  async findAll(@Res() res) {
    const bookings = await this.bookingService.findAll();
    return res.json({bookings});
  }

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

}
