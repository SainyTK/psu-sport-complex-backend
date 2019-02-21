import {
  Controller,
  Get,
  Post,
  Res,
  Body,
  UsePipes,
} from '@nestjs/common';
import { BookingService } from './booking.service';
import { BookingDTO } from './dto/booking.dto';
import { ValidationPipe } from 'src/common/validation.pipe';

@Controller('booking')
export class BookingController {
  constructor(private readonly bookingService: BookingService) { }

  @Get('/all')
  async findAll(@Res() res) {
    const result = await this.bookingService.findAll();
    return res.status(result.status).json(result.response);
  }

  @Get('/')
  async findCurrentWeek(@Res() res) {
    const result = await this.bookingService.findCurrentWeek();
    return res.status(result.status).json(result.response);
  }

  @UsePipes(new ValidationPipe())
  @Post()
  async book(@Body() dto:BookingDTO, @Res() res) {
    console.log(dto);
    const result = await this.bookingService.book(dto);
    return res.status(result.status).json(result.response);
  }

}
