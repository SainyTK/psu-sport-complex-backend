import {
  Controller,
  Post,
  Res,
  Body,
  HttpStatus,
} from '@nestjs/common';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) { }

  @Post('getToken')
  async getToken(@Body('username') username, @Body('password') password, @Res() res) {
    const token = await this.authService.signin(username, password);
    let response = {};
    let httpStatus = HttpStatus.OK;
    if (!token) {
      httpStatus = HttpStatus.BAD_REQUEST;
      response = {
        message: 'User not found'
      };
    }
    response = token;
    return res.status(httpStatus).json(response);
  }
}
