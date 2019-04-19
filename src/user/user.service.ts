import { Injectable, Inject, NotFoundException } from '@nestjs/common';
import { User } from './model/user.model';
import { USER_POSITION } from './constant/user-position';

@Injectable()
export class UserService {

  constructor(@Inject('userRepo') private readonly user: typeof User) { }

  async getUserByPhoneNumber(phoneNumber: string) {
    const user = await this.user.findOne({ where: {phoneNumber }});
    if (!user)
      return 'user not found';
    return user;
  }

  async createUser(data: User) {
    return await this.user.create(data);
  }

  async checkExistingUser({phoneNumber}: User) {
    let user = await this.user.findOne({
      where: {
        phoneNumber,
      }
    });
    if (user) {
      if (user.phoneNumber === phoneNumber)
        return 'user exist';
    }
    return false;
  }

  async updateUser(phoneNumber: string, data: User) {
    const user = await this.user.findOne({ where: { phoneNumber } });
    if (user)
      return 'user not found';
    return await user.update(data);
  }

  async upgradeUser(userId: number, position: string) {
    const user = await this.user.findByPk(userId);
    if (!user)
      return 'user not found';

    switch(position) {
      case 'member': 
        user.position = USER_POSITION.MEMBER;
        break;
      case 'admin':
        user.position = USER_POSITION.ADMIN;
        break;
    }
    return await user.update(user);
  }

  async deleteUser(phoneNumber: string) {
    const user = await this.user.findOne({ where: { phoneNumber } });
    if (!user)
      return 'user not found';
    await user.destroy();
    return true;
  }
}
