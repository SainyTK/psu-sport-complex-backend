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
  async getUser(@Body('username') data: string, @Res() res) {
    const user = await this.userService.getUserByusername(data);
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

  @Post('/create')
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
  async updateUser(@Body('user') data: User, @Body('username') username: string, @Res() res) {
    const user = await this.userService.updateUser(username, data);
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
  async deleteUser(@Body('username') username: string, @Res() res) {
    const user = await this.userService.deleteUser(username);
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

  @Post('/signin')
  async signin(@Body('logindata') loginData, @Res() res) {
    const user = await this.userService.signin(loginData.username, loginData.password);
    let status = HttpStatus.OK;
    let response = {};
    if (user === false) {
      status = HttpStatus.BAD_REQUEST;
      response = {
        message: 'User not found',
      }
    } else if(user === true) {
      status = HttpStatus.OK;
      response = {
        message: 'Wrong password',
      }
    } else {
      status = HttpStatus.OK;
      response = { user };
    }
    return res.status(status).json(response);
  }
}
