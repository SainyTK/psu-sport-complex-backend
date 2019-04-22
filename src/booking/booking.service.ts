import { Injectable, Inject } from '@nestjs/common';
import { Booking } from './model/booking.model';
import { Sequelize } from 'sequelize-typescript';
import TimeUtils from '../common/utils/time-utils';
import { User } from '../user/model/user.model';
import { Bill } from '../bill/model/bill.model';
import { BOOKING_STATUS } from './constant/booking-status';
import { Stadium } from '../stadium/model/stadium.model';
import { StadiumService } from '../stadium/stadium.service';
import { BillService } from '../bill/bill.service';
import moment from 'moment';

@Injectable()
export class BookingService {
  constructor(
    @Inject('bookingRepo') private readonly booking: typeof Booking,
    private readonly stadiumService: StadiumService,
    private readonly billService: BillService
  ) { }

  async findAll() {
    await this.filterExpired();
    return await this.booking.findAll({
      include: [Stadium, User, Bill],
      order: ['startDate']
    });
  }

  async findById(bookingId: number) {
    await this.filterExpired();
    return await this.booking.findOne({
      include: [Stadium, User, Bill],
      where: { bookingId },
      order: ['startDate']
    });
  }

  async findByBillId(billId: number) {
    await this.filterExpired();
    return await this.booking.findAll({
      include: [Stadium, User, Bill],
      where: { billId }
    })
  }

  async findByStadiumId(stadiumId: number) {
    await this.filterExpired();
    const bookings = await this.booking.findAll({
      include: [Stadium, User],
      where: { stadiumId }
    });
    return bookings;
  }

  async findByUserId(userId: number) {
    await this.filterExpired();
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

  async approve(bookingId: number, isApprove: boolean) {
    const booking = await this.booking.findByPk(bookingId);
    if (!booking)
      return { error: 'booking not found' }

    booking.status = isApprove ? BOOKING_STATUS.APPROVED : BOOKING_STATUS.UNAPPROVED;

    return await this.booking.update({status: booking.status}, {where: {bookingId: booking.bookingId}});
  }

  async approveByBill(billId: number) {
    const bill = await this.billService.findById(billId);
    if (!bill)
      return { error: 'bill not found' };

    const bookings = await this.findByBillId(billId);

    const result = await Promise.all(bookings.map(booking => this.approve(booking.bookingId, true)))

    return result;
  }

  async bookMany(dataList: Booking[]) {
    for (let data of dataList) {
      const error = await this.validateBooking(data);
      if (error)
        return {
          ...error,
          data
        };
    }

    const bill = await this.billService.createBill();

    const results = await dataList.map((data) => {
      data.billId = bill.billId;
      this.booking.create(data);
      return data;
    });

    return bill;
  }

  async book(data: Booking) {
    const error = await this.validateBooking(data);
    if (error)
      return error;

    const booking = await this.booking.create(data);
    return booking;
  }

  async deleteById(bookingId: number) {
    const booking = await this.booking.findByPk(bookingId);
    await booking.destroy()
    return 'delete success';
  }

  async deleteByBillId(billId: number) {
    const bookings = await this.findByBillId(billId);
    bookings.forEach((booking) => {
      this.booking.destroy({where: {bookingId: booking.bookingId}});
    });

    await this.billService.deleteById(billId);

    return 'delete success';
  }

  private async filterExpired() {
    const bookings = await this.booking.findAll({ where: { status: BOOKING_STATUS.UNPAID } });

    for(let booking of bookings) {
      if (moment().diff(booking.createdAt, 'minute') > 20)
        await this.deleteById(booking.bookingId);
    }
  }

  private async validateBooking(data: Booking) {
    const { startDate, endDate, stadiumId, courtId } = data;
    if (startDate > endDate)
      return { error: 'start date lead end date' };

    const overlapBooking = await this.findOverlapBooking(startDate, endDate, data);
    if (overlapBooking.length > 0)
      return { error: 'overlap booking' };

    const stadium = await this.stadiumService.findById(stadiumId);
    if (!stadium)
      return { error: `Stadium doesn't exist` };
    else if (courtId > stadium.numCourt || courtId <= 0)
      return { error: `Court doens't exist` };

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

}
