import {
  Controller,
  Post,
  Res,
  Body,
  UsePipes,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignupDTO } from './dto/signup.dto';
import { ValidationPipe } from 'src/common/validation.pipe';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) { }

  @Post('/signup')
  @UsePipes(new ValidationPipe())
  async signup(@Body() dto: SignupDTO, @Res() res) {
    const user = await this.authService.signup(SignupDTO.toUser(dto));
    return res.json({user});
  } 

  @Post('/signin')
  @UsePipes(new ValidationPipe())
  async signinWithUsername(@Body('username') username: string, @Body('password') password: string, @Res() res) {
    const token = await this.authService.signinWithUsername(username, password);
    return res.json({token});
  }

  @Post('/sign_token')
  @UsePipes(new ValidationPipe())
  async signWithToken(@Body('accessToken') token: string, @Res() res) {
    const newToken = await this.authService.signinWithToken(token);
    return res.json({newToken});
  }

}
