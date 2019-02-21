import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Res,
  Body,
  HttpStatus,
  UseGuards,
} from '@nestjs/common';
import { UserService } from './user.service';
import { User } from './model/user.model';
import { AuthGuard } from '@nestjs/passport';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @UseGuards(AuthGuard())
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

  @Post()
  async createUser(@Body() data: User, @Res() res) {
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

  @UseGuards(AuthGuard())
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

  @UseGuards(AuthGuard())
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

}
