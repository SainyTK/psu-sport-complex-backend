import { Injectable, Inject } from '@nestjs/common';
import { Stadium } from './model/stadium.model';
import { Booking } from '../booking/model/booking.model';
import { USER_POSITION } from '../user/constant/user-position';

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

  async calculateFee(userPosition: string, bookings: Booking[]) {
    if (!bookings || bookings.length <= 0)
      return 0;
    
    const l = bookings.length;
    const stadiumId = bookings[0].stadiumId;
    const stadium = await this.stadium.findByPk(stadiumId);

    switch (userPosition) {
      case USER_POSITION.GENERAL_PUBLIC: return stadium.costPublic * l;
      case USER_POSITION.MEMBER: return stadium.costMember * l;
      case USER_POSITION.STAFF: return stadium.costStaff * l;
      case USER_POSITION.STUDENT: return stadium.costStudent *l;
      default: return 0;
    }
  }
}
