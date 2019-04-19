import {
  Controller,
  Patch,
  Delete,
  Res,
  Body,
  UseGuards,
  Req,
  Param,
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
  @Patch('/upgrade/:userId')
  async upgradeUser(@Body('position') position: string,@Param('userId') userId: number, @Req() req, @Res() res) {
    await this.authService.checkAdminFromToken(extractToken(req));
    const result = await this.userService.upgradeUser(userId, position);
    return res.json({result});
  }

  @UseGuards(AuthGuard())
  @Patch()
  async updateUser(@Body('user') data: User, @Body('phoneNumber') phoneNumber: string, @Res() res) {
    const user = await this.userService.updateUser(phoneNumber, data);
    return res.json(user);
  }

  @UseGuards(AuthGuard())
  @Delete()
  async deleteUser(@Body('phoneNumber') phoneNumber: string, @Res() res) {
    await this.userService.deleteUser(phoneNumber);
    return res.json({ message: 'delete success' });
  }

}
