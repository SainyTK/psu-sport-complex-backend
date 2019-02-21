import { Injectable, Inject } from '@nestjs/common';
import { Booking } from './model/booking.model';
import { Result } from 'src/common/result';
import { BookingDTO } from './dto/booking.dto';
import { Sequelize } from 'sequelize-typescript';
import TimeUtils from '../common/utils/time-utils';
import { User } from 'src/user/model/user.model';
import { Court } from 'src/court/model/court.model';

@Injectable()
export class BookingService {
  private result: Result;

  constructor(@Inject('bookingRepo') private readonly booking: typeof Booking) {
    this.result = new Result('Booking');
  }

  async findAll() {
    const bookings = await this.booking.findAll();
    return this.result.found(bookings);
  }

  async findCurrentWeek() {
    const Op = Sequelize.Op;
    const todayZOclock = TimeUtils.zeroOclock(new Date());
    const dayNextWeekZOclock = TimeUtils.zeroOclock(TimeUtils.nextXDate(new Date(), 7));

    const bookings = await this.booking.findAll({
      include: [User, Court],
      where: {
        finishTime: {
          [Op.between]: [
            todayZOclock,
            dayNextWeekZOclock
          ]
        }
      },
      order: [['startTime']]
    });

    return this.result.found(bookings);
  }

  async book(dto: BookingDTO) {
    const { startTime, finishTime } = dto;
    if (startTime > finishTime)
      return this.result.badRequest();

    const overlapBooking = await this.findOverlapBooking(startTime, finishTime);
    if(overlapBooking.length > 0)
      return this.result.exist();

    const booking = await this.booking.create(dto);
    return this.result.success('booking',booking);
  }

  private async findOverlapBooking(startTime: Date, finishTime: Date) {
    const Op = Sequelize.Op;
    const bookings = await this.booking.findAll({
      where: {
        [Op.or]: [
          {
            startTime: {
              [Op.gte]: startTime,
              [Op.lt]: finishTime
            }
          },
          {
            finishTime: {
              [Op.gt]: startTime,
              [Op.lte]: finishTime
            }
          }
        ]
      }
    });
    return bookings;
  }
}
