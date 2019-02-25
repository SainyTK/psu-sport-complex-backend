import {
  Controller,
  Patch,
  Delete,
  Res,
  Body,
  UseGuards,
} from '@nestjs/common';
import { UserService } from './user.service';
import { User } from './model/user.model';
import { AuthGuard } from '@nestjs/passport';


@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @UseGuards(AuthGuard())
  @Patch()
  async updateUser(@Body('user') data: User, @Body('username') username: string, @Res() res) {
    const user = await this.userService.updateUser(username, data);
    return res.json(user);
  }

  @UseGuards(AuthGuard())
  @Delete()
  async deleteUser(@Body('username') username: string, @Res() res) {
    await this.userService.deleteUser(username);
    return res.json({message: 'delete success'});
  }

}
