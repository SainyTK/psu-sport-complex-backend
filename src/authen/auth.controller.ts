import {
  Controller,
  Post,
  Patch,
  Param,
  Res,
  Body,
  UsePipes,
  HttpStatus,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignupDTO } from './dto/signup.dto';
import { ValidationPipe } from '../common/validation.pipe';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) { }

  @Post('/signup')
  @UsePipes(new ValidationPipe())
  async signup(@Body() dto: SignupDTO, @Res() res) {
    const result = await this.authService.signup(SignupDTO.toUser(dto));
    return res.status(HttpStatus.OK).json(result);
  }

  @Post('/signin')
  @UsePipes(new ValidationPipe())
  async signin(@Body('signInfo') signInfo: string, @Body('password') password: string, @Res() res) {
    const result = await this.authService.signin(signInfo, password);
    return res.status(HttpStatus.OK).json(result);
  }

  @Post('/sign_token')
  @UsePipes(new ValidationPipe())
  async signWithToken(@Body('accessToken') token: string, @Res() res) {
    const result = await this.authService.signinWithToken(token);
    return res.status(HttpStatus.OK).json(result);
  }

  @Post('/forget_password')
  @UsePipes(new ValidationPipe())
  async forgetPassword(@Body('phoneNumber') phoneNumber: string, @Res() res) {
    const result = await this.authService.forgetPassword(phoneNumber);
    return res.status(HttpStatus.OK).json(result);
  }

  @Patch('/reset/:resetToken')
  async resetPassword(@Param('resetToken') resetToken, @Body('password') password, @Res() res) {
    const result = await this.authService.resetPassword(resetToken, password);
    return res.status(HttpStatus.OK).json(result);
  }

}
