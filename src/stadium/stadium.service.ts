import { Injectable, Inject } from '@nestjs/common';
import { Stadium } from './model/stadium.model';
import { Booking } from '../booking/model/booking.model';
import { USER_POSITION } from '../user/constant/user-position';
import moment from 'moment';

@Injectable()
export class StadiumService {
  constructor(@Inject('stadiumRepo') private readonly stadium: typeof Stadium) {}

  async findAll() {
    return await this.stadium.findAll();
  }

  async findById(stadiumId: number) {
    const stadium = await this.stadium.findById(stadiumId);
    return stadium;
  }

  async insert(stadium: Stadium) {
    return await this.stadium.create(stadium);
  }

  calculateBookingFee(userPosition: string, booking: Booking, stadium: Stadium) {
    if (!booking)
      return 0;

      const { startDate, endDate } = booking;
      let hrDiff = moment(endDate).diff(moment(startDate), 'hour');
      let minDiff = moment(endDate).diff(moment(startDate), 'minute') % 60 >= 30 ? 0.5 : 0;
    
      let duration = hrDiff + minDiff;

      switch (userPosition) {
        case USER_POSITION.GENERAL_PUBLIC: return stadium.costPublic * duration;
        case USER_POSITION.MEMBER: return stadium.costMember * duration;
        case USER_POSITION.STAFF: return stadium.costStaff * duration;
        case USER_POSITION.STUDENT: return stadium.costStudent *duration;
        default: return 0;
      }
  }

  async calculateBookingsFee(userPosition: string, bookings: Booking[]) {
    if (!bookings || bookings.length <= 0)
      return 0;
    
    const stadiumId = bookings[0].stadiumId;
    const stadium = await this.stadium.findByPk(stadiumId);

    let sumFee = bookings.reduce((sum, booking) => sum + this.calculateBookingFee(userPosition, booking, stadium), 0);
    
    return sumFee;
  }
}
