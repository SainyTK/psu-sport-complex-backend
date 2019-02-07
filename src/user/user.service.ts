import { Injectable, Inject } from '@nestjs/common';
import { User } from './model/user.model';

@Injectable()
export class UserService {
  constructor(@Inject('userRepo') private readonly user: typeof User) {}

  async createUser(data: User) {
    const user = await this.user.find({where: {userName: data.userName}});
    if (user) {
      return false;
    }
    return await this.user.create(user);
  }

  async getUserByUserName(userName: string) {
    const user = await this.user.find({where: {userName}});
    if (user) {
      return user;
    }
    return false;
  }

  async updateUser(userName: string, data: User) {
    const user = await this.user.find({where: {userName}});
    if (user) {
      return await user.update(data);
    }
    return false;
  }

  async deleteUser(userName: string) {
    const user = await this.user.find({where: {userName}});
    if (user) {
      return await user.destroy();
    }
    return false;
  }
}
