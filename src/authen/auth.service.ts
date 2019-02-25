import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
  BadRequestException,
} from '@nestjs/common';
import { UserService } from 'src/user/user.service';
import { JwtService } from '@nestjs/jwt';
import { JwtPayload } from './interfaces/jwt.payload';
import { User } from 'src/user/model/user.model';
import * as bcrypt from 'bcrypt';

const saltRounds = 10;

@Injectable()
export class AuthService {

  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
  ) {}

  async signup(data: User) {
    let user = await this.userService.checkExistingUser(data.username);
    if (user) {
      throw new BadRequestException('User is already exist');
    }

    const hashPassword = await bcrypt.hash(data.password, saltRounds);
    data.password = hashPassword;
    await this.userService.createUser(data);
    return data;
  }

  async signinWithUsername(username: string, password: string) {
    let user = null;
    let isPasswordCorrect = false;

    user = await this.userService.getUserByusername(username);
    if (!user) {
      user = await this.userService.getUserByEmail(username);
      if (!user)
        throw new NotFoundException('user not found');
    }

    isPasswordCorrect = await this.validatePassword(user, password);
    if (!isPasswordCorrect)
        throw new UnauthorizedException('incorrect password');

    return await this.createToken(JwtPayload.fromModel(user));
  }

  async signinWithToken(token: string) {
    const data = this.jwtService.decode(token) as JwtPayload;
    const user = await this.validate(data);
    if (!user)
      throw new UnauthorizedException('incorrent token');  
    const newToken = await this.createToken(JwtPayload.fromModel(user));
    return newToken;
  }

  private async validatePassword(user: User, password: string) {
    return await bcrypt.compare(password, user.password);
  }

  private async validate(payload: JwtPayload) {
    if (!payload) return false;
    return await this.userService.getUserByusername(payload.username);
  }

  private async createToken(payload: JwtPayload) {
    const accessToken = this.jwtService.sign(payload);
    return {
      expiresIn: 3600,
      accessToken
    }
  }
}
