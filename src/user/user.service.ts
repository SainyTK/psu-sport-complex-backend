import { Injectable, Inject, NotFoundException } from '@nestjs/common';
import { User } from './model/user.model';

@Injectable()
export class UserService {

  constructor(@Inject('userRepo') private readonly user: typeof User) {}

  async createUser(data: User) {
    return await this.user.create(data);
  }

  async getUserByusername(username: string) {
    const user = await this.user.findOne({where: {username}});
    if (user) {
      return user;
    }
    throw new NotFoundException('user not found');
  }

  async checkExistingUser(username: string) {
    const user = await this.user.findOne({where: {username}});
    if (user) {
      return user;
    }
    return false;
  }

  async getUserByEmail(email: string) {
    const user = await this.user.findOne({where: {email}});
    if (user) {
      return user;
    }
    throw new NotFoundException('user not found');
  }

  async updateUser(username: string, data: User) {
    const user = await this.user.findOne({where: {username}});
    if (user) {
      const updatedUser = await user.update(data);
      return updatedUser
    }
    throw new NotFoundException('user not found');
  }

  async deleteUser(username: string) {
    const user = await this.user.findOne({where: {username}});
    if (user) {
      await user.destroy();
      return true;
    }
    throw new NotFoundException('user not found');
  }
}
