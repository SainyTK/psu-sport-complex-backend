import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Res,
  Body,
  HttpStatus,
} from '@nestjs/common';
import { UserService } from './user.service';
import { User } from './model/user.model';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  async getUser(@Body('userName') data: string, @Res() res) {
    const user = await this.userService.getUserByUserName(data);
    let status = HttpStatus.OK;
    let response = {};
    if (user === false) {
      status = HttpStatus.BAD_REQUEST;
      response = {
        message: 'User not found',
      };
    } else {
      response = {user};
    }
    return res.status(status).json(response);
  }

  @Post()
  async createUser(@Body('user') data: User, @Res() res) {
    const user = await this.userService.createUser(data);
    let status = HttpStatus.OK;
    let response = {};
    if (user === false) {
      status = HttpStatus.CREATED;
      response = {
        message: 'User is already exist',
      };
    } else {
      response = {user};
    }
    return res.status(status).json(response);
  }

  @Patch()
  async updateUser(@Body('user') data: User,@Body('userName') userName: string, @Res() res) {
    const user = await this.userService.updateUser(userName, data);
    let status = HttpStatus.OK;
    let response = {};
    if (user === false) {
      status = HttpStatus.BAD_REQUEST;
      response = {
        message: 'User not found',
      };
    } else {
      response = {user};
    }
    return res.status(status).json(response);
  }

  @Delete()
  async deleteUser(@Body('userName') userName: string, @Res() res) {
    const user = await this.userService.deleteUser(userName);
    let status = HttpStatus.OK;
    let response = {};
    if (user === false) {
      status = HttpStatus.BAD_REQUEST;
      response = {
        message: 'User not found',
      };
    } else {
      response = {
        message: 'User deleted',
      };
    }
    return res.status(status).json(response);
  }
}
