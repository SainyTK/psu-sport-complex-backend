import * as bcrypt from 'bcrypt';
import { Injectable, Inject, Body } from '@nestjs/common';
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

  async signin(username: string, password: string) {
    const user = await this.user.findOne({where: {username}});
    if (user) {
      const isPasswordCorrect = await bcrypt.compare(password, user.password);
      if (isPasswordCorrect) {
        return user;
      }
      return true;
    }
    return false;
  }
}
