import {
  Controller,
  Patch,
  Delete,
  Res,
  Body,
  UseGuards,
  Req,
  Param,
  Get,
  Post,
  UsePipes,
  ValidationPipe,
  HttpStatus
} from '@nestjs/common';
import { UserService } from './user.service';
import { User } from './model/user.model';
import { AuthGuard } from '@nestjs/passport';
import { AuthService } from '../authen/auth.service';
import { extractToken } from '../common/utils/extract-token';
import { MemberDTO } from './dto/member.dto';


@Controller('user')
export class UserController {
  constructor(
    private readonly userService: UserService,
    private readonly authService: AuthService
  ) { }

  @Get('/')
  async getAllUser(@Res() res) {
    const users = await this.userService.getAllUsers();
    return res.json(users);
  }

  @Get('/reset/:resetToken')
  async getUserByResetToken(@Param('resetToken') resetToken: string, @Res() res) {
    const result = await this.userService.getUserByResetToken(resetToken);
    return res.json(result);
  }

  @UseGuards(AuthGuard())
  @Patch('/upgrade/:userId')
  async upgradeUser(@Body('position') position: string,@Param('userId') userId: number, @Req() req, @Res() res) {
    await this.authService.checkAdminFromToken(extractToken(req));
    const result = await this.userService.upgradeUser(userId, position);
    return res.json({result});
  }

  @Patch('/member/:userId')
  @UsePipes(new ValidationPipe())
  async toMember(@Body() data: MemberDTO,@Param('userId') userId, @Res() res) {
    const result = await this.userService.toMember(+userId, data);
    return res.status(HttpStatus.OK).json(result);
  }

  @UseGuards(AuthGuard())
  @Patch()
  async updateUser(@Body() data: User, @Res() res) {
    const user = await this.userService.updateUser(data);
    return res.json(user);
  }

  @UseGuards(AuthGuard())
  @Delete()
  async deleteUser(@Body('phoneNumber') phoneNumber: string, @Res() res) {
    await this.userService.deleteUser(phoneNumber);
    return res.json({ message: 'delete success' });
  }

}
