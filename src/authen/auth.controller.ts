import {
  Controller,
  Post,
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
  async signinWithPhoneNumber(@Body('phoneNumber') phoneNumber: string, @Body('password') password: string, @Res() res) {
    const result = await this.authService.signinWithPhoneNumber(phoneNumber, password);
    return res.status(HttpStatus.OK).json(result);
  }

  @Post('/sign_token')
  @UsePipes(new ValidationPipe())
  async signWithToken(@Body('accessToken') token: string, @Res() res) {
    const result = await this.authService.signinWithToken(token);
    return res.status(HttpStatus.OK).json(result);
  }

}
