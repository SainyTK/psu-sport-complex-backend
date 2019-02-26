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
import { USER_POSITION } from '../user/constant/user-position';

const saltRounds = 10;

@Injectable()
export class AuthService {

  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
  ) { }

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
    try {
      const data = this.jwtService.decode(token) as JwtPayload;
      const user = await this.validate(data);
      if (!user)
        throw new UnauthorizedException();
      const newToken = await this.createToken(JwtPayload.fromModel(user));
      return newToken;
    } catch (e) {
      throw new BadRequestException('Token Error');
    }
  }

  async checkPositionFromToken(accessToken: string, position: string) {
    const user = await this.validateToken(accessToken) as User;
    if (!user)
      throw new UnauthorizedException();
    return user.position === position;
  }

  async checkAdminFromToken(accessToken: string) {
    const isAdmin = await this.checkPositionFromToken(accessToken, USER_POSITION.ADMIN);
    if (!isAdmin)
      throw new UnauthorizedException('permission denied');
  }

  async validateToken(accessToken: string) {
    const payload = this.jwtService.decode(accessToken) as JwtPayload;
    return await this.validate(payload);
  }

  private async validate(payload: JwtPayload) {
    if (!payload) return false;
    return await this.userService.getUserByusername(payload.username);
  }

  private async validatePassword(user: User, password: string) {
    return await bcrypt.compare(password, user.password);
  }

  private async createToken(payload: JwtPayload) {
    const accessToken = this.jwtService.sign(payload);
    return {
      expiresIn: 3600,
      accessToken
    }
  }
}
