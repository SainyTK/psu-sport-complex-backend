import { Injectable, Inject, NotFoundException } from '@nestjs/common';
import { User } from './model/user.model';
import { USER_POSITION } from './constant/user-position';
import { MemberDTO } from './dto/member.dto';
import moment from 'moment';

@Injectable()
export class UserService {

  constructor(@Inject('userRepo')
  private readonly user: typeof User
  ) { }

  async getAllUsers() {
    const users = await this.user.findAll();

    return await this.filterMembers(users);
  }

  async getUserById(userId: number) {
    const user = await this.user.findByPk(userId);

    if (!user)
      return false;

    return await this.filterMember(user);
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
      return { error: 'user not found' }

    return await this.filterMember(user);
  }

  async getUserByPhoneNumber(phoneNumber: string): Promise<any> {
    const user = await this.user.findOne({ where: { phoneNumber } });
    if (!user)
      return { error: 'user not found' };
    return await this.filterMember(user);
  }

  async getUserByPSUPassport(psuPassport: string) {
    const user = await this.user.findOne({ where: { psuPassport } });
    if (!user)
      return null;
    return user;
  }

  async getUserByRefreshToken(refreshToken: string): Promise<any> {
    const user = await this.user.findOne({ where: { refreshToken } });
    if (!user)
      return { error: 'user not found' };
    return await this.filterMember(user);
  }

  async createUser(data: User) {
    return await this.user.create({ ...data, prevPosition: data.position });
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

  async toggleAdmin(userId: number, secret: string) {
    if (secret !== 'psu-sport-complex')
      return { error: 'secret invalid' }

    const user = await this.user.findById(userId);
    if (!user)
      return { error: 'user not found' };

    const toggledPosition = user.position === USER_POSITION.ADMIN ? user.prevPosition : USER_POSITION.ADMIN;
    await user.update({ position: toggledPosition, prevPosition: user.position });

    return 'update success';
  }

  async updateUser(data: User): Promise<any> {
    const user = await this.user.findByPk(data.userId);
    if (!user)
      return { error: 'user not found' };

    return await user.update(data);
  }

  async upgradeUser(userId: number, position: string) {
    const user = await this.user.findByPk(userId);
    if (!user)
      return { error: 'user not found' };

    switch (position) {
      case 'member':
        user.position = USER_POSITION.MEMBER;
        break;
      case 'admin':
        user.position = USER_POSITION.ADMIN;
        break;
    }
    return await user.update({ position: user.position });
  }

  async toMember(userId: number, data: MemberDTO): Promise<any> {
    const { startDate, endDate, amount } = data;
    const user = await this.user.findByPk(userId);

    if (!user)
      return { error: 'user not found' };

    if (user.position !== USER_POSITION.GENERAL_PUBLIC)
      return { error: `this user can't upgrage to member` };

    user.memberStart = moment(startDate).toDate();
    user.memberEnd = moment(endDate).toDate();
    user.position = USER_POSITION.MEMBER;

    const result = await user.update({
      memberStart: moment(startDate).toDate(),
      memberEnd: moment(endDate).toDate(),
      position: USER_POSITION.MEMBER
    });

    return result;
  }

  async deleteUser(phoneNumber: string) {
    const user = await this.user.findOne({ where: { phoneNumber } });
    if (!user)
      return { error: 'user not found' };
    await user.destroy();
    return true;
  }

  private async filterMember(user: User) {
    if (!user.memberEnd)
      return user;

    if (moment(user.memberEnd).diff(moment(), 'days') <= 0) {
      return await user.update({
        memberStart: null,
        memberEnd: null,
        position: USER_POSITION.GENERAL_PUBLIC
      })
    }

    return user;
  }

  private async filterMembers(users: User[]) {
    const promises = users.map((user) => this.filterMember(user));
    const result = await Promise.all(promises);
    return result;
  }
}
