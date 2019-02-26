import { Injectable, Inject, BadRequestException } from '@nestjs/common';
import { Booking } from './model/booking.model';
import { Sequelize } from 'sequelize-typescript';
import TimeUtils from '../common/utils/time-utils';
import { User } from 'src/user/model/user.model';
import { Court } from 'src/court/model/court.model';

@Injectable()
export class BookingService {
  constructor(@Inject('bookingRepo') private readonly booking: typeof Booking) {}

  async findAll() {
    return await this.booking.findAll();
  }

  async findCurrentWeek() {
    const Op = Sequelize.Op;
    const todayZOclock = TimeUtils.zeroOclock(new Date());
    const dayNextWeekZOclock = TimeUtils.zeroOclock(TimeUtils.nextXDate(new Date(), 7));

    const bookings = await this.booking.findAll({
      include: [User, Court],
      where: {
        endDate: {
          [Op.between]: [
            todayZOclock,
            dayNextWeekZOclock
          ]
        }
      },
      order: [['startDate']]
    });

    return bookings;
  }

  async book(data: Booking) {
    const { startDate, endDate } = data;
    if (startDate > endDate)
      throw new BadRequestException('start date ahead end date');

    const overlapBooking = await this.findOverlapBooking(startDate, endDate);
    if(overlapBooking.length > 0)
      throw new BadRequestException('already exist');

    const booking = await this.booking.create(data);
    return booking;
  }

  private async findOverlapBooking(startDate: Date, endDate: Date) {
    const Op = Sequelize.Op;
    const bookings = await this.booking.findAll({
      where: {
        [Op.or]: [
          {
            startDate: {
              [Op.gte]: startDate,
              [Op.lt]: endDate
            }
          },
          {
            endDate: {
              [Op.gt]: startDate,
              [Op.lte]: endDate
            }
          }
        ]
      }
    });
    return bookings;
  }
}
