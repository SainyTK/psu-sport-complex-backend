import {
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { UserService } from '../user/user.service';
import { JwtService } from '@nestjs/jwt';
import { JwtPayload } from './interfaces/jwt.payload';
import { User } from '../user/model/user.model';
import * as bcrypt from 'bcrypt';
import { USER_POSITION } from '../user/constant/user-position';
import { Booking } from 'src/booking/model/booking.model';
import * as soap from 'soap';

const saltRounds = 10;
const PSU_URL = 'https://passport.psu.ac.th/authentication/authentication.asmx?wsdl';

enum SIGNIN_TYPE {
  PHONE_NUMBER,
  PSU_PASSPORT
}

@Injectable()
export class AuthService {

  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
  ) { }

  async signup(data: User) {
    let exist = await this.userService.checkExistingUser(data);
    if (exist) {
      return exist;
    }

    const hashPassword = await bcrypt.hash(data.password, saltRounds);
    data.password = hashPassword;
    await this.userService.createUser(data);
    return data;
  }

  async signin(signInfo: string, password: string) {
    const signinType = this.checkSignInType(signInfo);

    switch (signinType) {
      case SIGNIN_TYPE.PHONE_NUMBER:
        return await this.signinWithPhoneNumber(signInfo, password);
      case SIGNIN_TYPE.PSU_PASSPORT:
        return await this.signinWithPSUPassport(signInfo, password);
    }
  }

  async signinWithPhoneNumber(phoneNumber: string, password: string) {
    let result = null;
    let isPasswordCorrect = false;

    result = await this.userService.getUserByPhoneNumber(phoneNumber);
    if (result === 'user not found') {
      return 'user not found';
    }

    isPasswordCorrect = await this.validatePassword(result, password);
    if (!isPasswordCorrect)
      return 'incorrect password';

    return await this.createToken(JwtPayload.fromModel(result));
  }

  async signinWithPSUPassport(psuPassport: string, password: string) {

    console.log('psuPassport', psuPassport);
    console.log('password', password);
    const result = await this.getPSUInfo(psuPassport, password);

    console.log(result);

    return 'OK';
  }

  async signinWithToken(token: string) {
    try {
      const data = this.jwtService.decode(token) as JwtPayload;
      const result = await this.validate(data);
      if (result === 'user not found')
        return 'user not found';
      const newToken = await this.createToken(JwtPayload.fromModel(result));
      return newToken;
    } catch (e) {
      return 'token error';
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

  async checkOwnerFromToken(accessToken: string, booking: Booking) {
    const user = await this.validateToken(accessToken) as User;
    const isOwner = user.userId === booking.userId;
    if (!isOwner)
      throw new UnauthorizedException('permission denied');
  }

  async validateToken(accessToken: string) {
    const payload = this.jwtService.decode(accessToken) as JwtPayload;
    return await this.validate(payload);
  }

  async validate(payload: JwtPayload) {
    if (!payload) return false;
    return await this.userService.getUserByPhoneNumber(payload.phoneNumber);
  }

  private async validatePassword(user: User, password: string) {
    if (!user || !password)
      return false;
    return await bcrypt.compare(password, user.password);
  }

  private async createToken(payload: JwtPayload) {
    const accessToken = this.jwtService.sign(payload);
    return {
      expiresIn: 3600 * 24 * 3,
      accessToken
    }
  }

  private async getPSUInfo(psuPassport: string, password: string): Promise<any> {
    return new Promise<any>((resolve, reject) => {
      soap.createClient(PSU_URL, (err, client) => {
        if (err) return reject(err);

        let user = {
          name: psuPassport,
          password: password
        }

        client.GetStudentDetails(user, (err, response) => {
          if (err) return reject(err);
          else
            return resolve(response);
        })
      })
    })
  }

  private checkSignInType(userInfo: string) {
    return userInfo.startsWith('0') ? SIGNIN_TYPE.PHONE_NUMBER : SIGNIN_TYPE.PSU_PASSPORT;
  }
}
