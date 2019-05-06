import { Injectable, Inject, NotFoundException } from '@nestjs/common';
import { User } from './model/user.model';
import { USER_POSITION } from './constant/user-position';

@Injectable()
export class UserService {

  constructor(@Inject('userRepo') private readonly user: typeof User) { }

  async getAllUsers() {
    return await this.user.findAll();
  }

  async getUserById(userId: number) {
    const user = await this.user.findByPk(userId);

    if (!user) 
      return false;
    
    return user;
  }

  async getUserByResetToken(resetPasswordToken: string): Promise<any> {
    const user = await this.user.findOne({
      where: {
        resetPasswordToken,
        resetPasswordExpires: {
          $gt: Date.now()
        }
      }
    })

    if (!user)
      return { error: 'User not found' }

    return user;
  }

  async getUserByPhoneNumber(phoneNumber: string): Promise<any> {
    const user = await this.user.findOne({ where: { phoneNumber } });
    if (!user)
      return { error: 'User not found' };
    return user;
  }

  async getUserByPSUPassport(psuPassport: string) {
    const user = await this.user.findOne({ where: { psuPassport } });
    if (!user)
      return null;
    return user;
  }

  async createUser(data: User) {
    return await this.user.create(data);
  }

  async checkExistingUser({ phoneNumber }: User) {
    let user = await this.user.findOne({
      where: {
        phoneNumber,
      }
    });
    if (user) {
      if (user.phoneNumber === phoneNumber)
        return { error: 'user exist' };
    }
    return false;
  }

  async updateUser(data: User): Promise<any> {
    const user = await this.user.findOne({ where: { phoneNumber: data.phoneNumber } });
    if (!user)
      return { error: 'User not found' };
    
    return await user.update(data);
  }

  async upgradeUser(userId: number, position: string) {
    const user = await this.user.findByPk(userId);
    if (!user)
      return { error: 'User not found' };

    switch (position) {
      case 'member':
        user.position = USER_POSITION.MEMBER;
        break;
      case 'admin':
        user.position = USER_POSITION.ADMIN;
        break;
    }
    return await this.user.update({ position: user.position }, { where: { userId } });
  }

  async deleteUser(phoneNumber: string) {
    const user = await this.user.findOne({ where: { phoneNumber } });
    if (!user)
      return { error: 'User not found' };
    await user.destroy();
    return true;
  }
}
