import { Injectable, Inject, NotFoundException } from '@nestjs/common';
import { User } from './model/user.model';
import { USER_POSITION } from './constant/user-position';

@Injectable()
export class UserService {

  constructor(@Inject('userRepo') private readonly user: typeof User) { }

  async createUser(data: User) {
    return await this.user.create(data);
  }

  async getUserByusername(username: string) {
    const user = await this.user.findOne({ where: { username } });
    if (!user)
      throw new NotFoundException('user not found');
    return user;
  }

  async checkExistingUser(username: string) {
    const user = await this.user.findOne({ where: { username } });
    if (user) {
      return user;
    }
    return false;
  }

  async getUserByEmail(email: string) {
    const user = await this.user.findOne({ where: { email } });
    if (!user)
      throw new NotFoundException('user not found');
    return user;
  }

  async updateUser(username: string, data: User) {
    const user = await this.user.findOne({ where: { username } });
    if (user)
      throw new NotFoundException('user not found');
    return await user.update(data);
  }

  async upgradeUser(username: string) {
    const user = await this.user.findOne({ where: { username } });
    if (!user)
      throw new NotFoundException('user not found');

    if (user.position === USER_POSITION.GENERAL_PUBLIC)
      user.position = USER_POSITION.MEMBER;
    return await user.update(user);
  }

  async deleteUser(username: string) {
    const user = await this.user.findOne({ where: { username } });
    if (!user)
      throw new NotFoundException('user not found');
    await user.destroy();
    return true;
  }
}
