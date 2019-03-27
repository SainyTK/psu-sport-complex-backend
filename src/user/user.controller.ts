import {
  Controller,
  Patch,
  Delete,
  Res,
  Body,
  UseGuards,
  Req,
} from '@nestjs/common';
import { UserService } from './user.service';
import { User } from './model/user.model';
import { AuthGuard } from '@nestjs/passport';
import { AuthService } from '../authen/auth.service';
import { extractToken } from '../common/utils/extract-token';


@Controller('user')
export class UserController {
  constructor(
    private readonly userService: UserService,
    private readonly authService: AuthService
  ) { }

  @UseGuards(AuthGuard())
  @Patch('/upgrade')
  async upgradeUser(@Body('username') username: string, @Req() req, @Res() res) {
    await this.authService.checkAdminFromToken(extractToken(req));
    const result = await this.userService.upgradeUser(username);
    return res.json({result});
  }

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
    return res.json({ message: 'delete success' });
  }

}
