import { Injectable, Inject, forwardRef } from '@nestjs/common';
import { Booking } from './model/booking.model';
import { Sequelize } from 'sequelize-typescript';
import TimeUtils from '../common/utils/time-utils';
import { User } from '../user/model/user.model';
import { Bill } from '../bill/model/bill.model';
import { BOOKING_STATUS } from './constant/booking-status';
import { Stadium } from '../stadium/model/stadium.model';
import { StadiumService } from '../stadium/stadium.service';
import { BillService } from '../bill/bill.service';
import { OperationTimeService } from '../operationTime/operationTime.service';
import moment from 'moment';
import { BookingGateway } from './booking.gateway';

@Injectable()
export class BookingService {

  constructor(
    @Inject('bookingRepo') private readonly booking: typeof Booking,
    private readonly stadiumService: StadiumService,
    private readonly operationTimeService: OperationTimeService,
    @Inject(forwardRef(() => BillService)) private readonly billService: BillService,
    private readonly gateway: BookingGateway
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

    const status = isApprove ? BOOKING_STATUS.APPROVED : BOOKING_STATUS.UNAPPROVED;

    return await booking.update({ status });
  }

  async approveByBill(billId: number) {
    const bill = await this.billService.findById(billId);
    if (!bill)
      return { error: 'bill not found' };

    const bookings = await this.findByBillId(billId);

    const result = await Promise.all(bookings.map(booking => this.approve(booking.bookingId, true)));

    this.serverEmit('updateBookings', result);

    return result;
  }

  async bookMany(userPosition: string, dataList: Booking[]) {
    let userId;
    for (let data of dataList) {
      const error = await this.validateBooking(data);
      if (error)
        return {
          ...error,
          data
        };
      userId = data.userId;
    }

    const fee = await this.stadiumService.calculateBookingsFee(userPosition, dataList);
    const bill = await this.billService.createBill(userId, fee);

    const stadiumId = dataList[0].stadiumId;
    const stadium = await this.stadiumService.findById(stadiumId);


    const results = dataList.map((data) => (
      new Promise((resolve, reject) => {
        data.billId = bill.billId;
        data.fee = this.stadiumService.calculateBookingFee(userPosition, data, stadium);
        this.booking.create(data).then((v) => {
          resolve(v.dataValues);
        }).catch(e => { reject(e) });
      })
    ));

    const bookings = await Promise.all(results);
    
    this.serverEmit('createBookings', bookings);

    return bill;
  }

  async bookByAdmin(dataList: Booking[]) {
    let ownerPosition;
    let userId;
    for (let data of dataList) {
      const error = await this.validateBooking(data);
      if (error)
        return {
          ...error,
          data
        };
      ownerPosition = data.ownerPosition;
      userId = data.userId;
    }

    const fee = await this.stadiumService.calculateBookingsFee(ownerPosition, dataList);
    const bill = await this.billService.createBillByAdmin(userId, fee);

    const stadiumId = dataList[0].stadiumId;
    const stadium = await this.stadiumService.findById(stadiumId);

    const results = dataList.map((data) => (
      new Promise((resolve, reject) => {
        data.billId = bill.billId;
        data.fee = this.stadiumService.calculateBookingFee(ownerPosition, data, stadium);
        data.status = BOOKING_STATUS.APPROVED;
        this.booking.create(data).then((v) => {
          resolve(v.dataValues);
        }).catch(e => { reject(e) });
      })
    ));

    const bookings = await Promise.all(results);
    
    this.serverEmit('createBookings', bookings);

    return bookings;
  }

  async update(bookingId: number, data: Booking) {
    const booking = await this.findById(bookingId);
    if (!booking)
      return { error: 'Booking not found' };

    let error = this.operationTimeService.checkPassed(booking.startDate, booking.endDate);
    if (error) return error;
    let error2 = await this.validateBooking(data);
    if (error2) return error2;

    const result = await booking.update(data);
    
    this.serverEmit('updateBookings', [result]);

    return 'update success';
  }

  async deleteById(bookingId: number) {
    const booking = await this.booking.findByPk(bookingId);
    await booking.destroy()

    this.serverEmit('deleteBookings', [booking]);

    return 'delete success';
  }

  async deleteByBillId(billId: number) {
    const bookings = await this.findByBillId(billId);
    bookings.forEach((booking) => {
      this.booking.destroy({ where: { bookingId: booking.bookingId } });
    });

    await this.billService.deleteById(billId);

    this.serverEmit('deleteBookings', bookings);

    return 'delete success';
  }

  private async filterExpired() {
    const bookings = await this.booking.findAll({ where: { status: BOOKING_STATUS.UNPAID } });

    for (let booking of bookings) {
      if (moment().diff(booking.createdAt, 'minute') > 20)
        await this.deleteById(booking.bookingId);
    }
  }

  private async validateBooking(data: Booking) {
    const { startDate, endDate, stadiumId, courtId } = data;

    if (startDate > endDate)
      return { error: 'start date lead end date' };

    const outOfService = await this.operationTimeService.checkAvailableDate(startDate, endDate);

    if (outOfService)
      return { error: outOfService };

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

  private serverEmit(pipeName, data) {
    this.gateway.server.emit(pipeName, data);
  }

}
