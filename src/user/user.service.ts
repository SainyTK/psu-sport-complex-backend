import * as bcrypt from 'bcrypt';
import { Injectable, Inject } from '@nestjs/common';
import { User } from './model/user.model';

const saltRounds = 10;

@Injectable()
export class UserService {
  constructor(@Inject('userRepo') private readonly user: typeof User) {}

  async createUser(data: User) {
    const user = await this.user.findOne({where: {username: data.username}});
    if (user) {
      return false;
    }
    const hashPassword = await bcrypt.hash(data.password, saltRounds);
    data.password = hashPassword;
    return await this.user.create(data);
  }

  async getUserByusername(username: string) {
    const user = await this.user.findOne({where: {username}});
    if (user) {
      return user;
    }
    return false;
  }

  async updateUser(username: string, data: User) {
    const user = await this.user.findOne({where: {username}});
    if (user) {
      return await user.update(data);
    }
    return false;
  }

  async deleteUser(username: string) {
    const user = await this.user.findOne({where: {username}});
    if (user) {
      return await user.destroy();
    }
    return false;
  }

  async validatePassword(user: User, password: string) {
    return await bcrypt.compare(password, user.password);
  }
}
