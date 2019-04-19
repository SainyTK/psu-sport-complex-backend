import { Injectable, Inject } from '@nestjs/common';
import { Booking } from './model/booking.model';
import { Sequelize } from 'sequelize-typescript';
import TimeUtils from '../common/utils/time-utils';
import { User } from '../user/model/user.model';
import { BOOKING_STATUS } from './constant/booking-status';
import { Stadium } from '../stadium/model/stadium.model';
import { StadiumService } from '../stadium/stadium.service';

@Injectable()
export class BookingService {
  constructor(
    @Inject('bookingRepo') private readonly booking: typeof Booking,
    private readonly stadiumService: StadiumService
  ) { }

  async findAll() {
    return await this.booking.findAll({
      include: [Stadium, User],
      order: ['startDate']
    });
  }

  async findById(bookingId: number) {
    return await this.booking.findOne({
      include: [Stadium, User],
      where: { bookingId },
      order: ['startDate']
    });
  }

  async findByStadiumId(stadiumId: number) {
    const bookings = await this.booking.findAll({
      include: [Stadium, User],
      where: {stadiumId}
    });
    return bookings;
  }

  async findByUserId(userId: number) {
    return await this.booking.findAll({
      include: [Stadium, User],
      where: { userId },
      order: ['startDate']
    });
  }

  async findCurrentWeek() {
    const Op = Sequelize.Op;
    const todayZOclock = TimeUtils.zeroOclock(new Date());
    const dayNextWeekZOclock = TimeUtils.zeroOclock(TimeUtils.nextXDate(new Date(), 7));

    const bookings = await this.booking.findAll({
      include: [User, Stadium],
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

  async uploadSlip(bookingId: number, filename) {
    const booking = await this.booking.findByPk(bookingId);
    if (!booking)
      return { error: 'booking not found' };

    booking.slip = filename;
    booking.status = BOOKING_STATUS.PAID;

    const result = await this.booking.update({slip: filename, status: BOOKING_STATUS.PAID}, {where: {bookingId}});

    return booking;
  }

  async approve(bookingId: number, isApprove: boolean) {
    const booking = await this.booking.findByPk(bookingId);
    if (!booking)
      return { error: 'booking not found' }

    booking.status = isApprove ? BOOKING_STATUS.APPROVED : BOOKING_STATUS.UNAPPROVED;

    return await booking.update(booking);
  }

  async book(data: Booking) {
    const { startDate, endDate, stadiumId, courtId } = data;
    if (startDate > endDate)
      return { error: 'start date lead end date' };

    const overlapBooking = await this.findOverlapBooking(startDate, endDate, data);
    if (overlapBooking.length > 0)
      return { error: 'overlap booking' };

    const stadium = await this.stadiumService.findById(stadiumId);
    if (!stadium)
      return { error: `Stadium doesn't exist`};
    else if(courtId > stadium.numCourt || courtId <= 0)
      return { error: `Court doens't exist`};

    const booking = await this.booking.create(data);
    return this.findById(booking.bookingId);
  }

  private async findOverlapBooking(startDate: Date, endDate: Date, booking: Booking) {
    const Op = Sequelize.Op;
    const bookings = await this.booking.findAll({
      where: {
        stadiumId: booking.stadiumId,
        courtId: booking.courtId,
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

  async deleteById(bookingId: number) {
    const booking = await this.booking.findByPk(bookingId);
    await booking.destroy()
    return 'delete success';
  }
}
