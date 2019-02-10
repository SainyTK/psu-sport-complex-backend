import {
  Injectable,
  NotFoundException,
  UnauthorizedException
} from '@nestjs/common';
import { UserService } from 'src/user/user.service';
import { JwtService } from '@nestjs/jwt';
import { JwtPayload } from './interfaces/jwt.payload';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
  ) {}

  async signin(username: string, password: string) {
    let user = null;
    let isPasswordCorrect = false;

    user = await this.userService.getUserByusername(username);
    if (!user)
        throw new NotFoundException();

    isPasswordCorrect = await this.userService.validatePassword(user, password);
    if (!isPasswordCorrect)
        throw new UnauthorizedException();

    const payload: JwtPayload = {
      userId: user.userId,
      firstName: user.firstName,
      lastName: user.lastName,
      username: user.username,
    }

    return await this.createToken(payload);
  }

  async validate(payload: JwtPayload) {
    return await this.userService.getUserByusername(payload.username);
  }

  async createToken(payload: JwtPayload) {
    const accessToken = this.jwtService.sign(payload);
    return {
      expiresIn: 3600,
      accessToken
    }
  }
}
