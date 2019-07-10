import {
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import domainName from '../config/domain.config';
import { UserService } from '../user/user.service';
import { JwtService } from '@nestjs/jwt';
import { JwtPayload } from './interfaces/jwt.payload';
import { User } from '../user/model/user.model';
import { USER_POSITION } from '../user/constant/user-position';
import { Booking } from '../booking/model/booking.model';
import * as soap from 'soap';
import * as bcrypt from 'bcrypt';
import * as crypto from 'crypto';
import to from 'await-to-js';
import { sendEmail } from '../common/utils/sendmail-utils';
import moment from 'moment';

const saltRounds = 10;
const PSU_URL = 'https://passport.psu.ac.th/authentication/authentication.asmx?wsdl';

enum SIGNIN_TYPE {
  PHONE_NUMBER,
  PSU_PASSPORT,
  STUDENT,
  STAFF
}

@Injectable()
export class AuthService {

  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
  ) { }

  async createAdmin(data: User) {
    if (data.psuPassport.length <= 0) {
      let exist = await this.userService.checkExistingUser(data);
      if (exist) {
        return exist;
      }
    }

    const hashPassword = await bcrypt.hash(data.password, saltRounds);
    data.password = hashPassword;
    data.position = USER_POSITION.ADMIN;
    await this.userService.createUser(data);
    return data;
  }

  async signup(data: User) {
    if (data.psuPassport.length <= 0) {
      let exist = await this.userService.checkExistingUser(data);
      if (exist) {
        return exist;
      }
    }

    const hashPassword = await bcrypt.hash(data.password, saltRounds);
    data.password = hashPassword;
    await this.userService.createUser(data);
    return data;
  }

  async signin(signInfo: string, password: string) {
    const signinType = this.checkSignType(signInfo);

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
    if (result.error) {
      return result;
    }

    isPasswordCorrect = await this.validatePassword(result, password);
    if (!isPasswordCorrect)
      return { error: 'incorrect password' };

    return await this.updateRefreshToken(result);
  }

  async signinWithPSUPassport(psuPassport: string, password: string) {
    let result = await this.userService.getUserByPSUPassport(psuPassport);

    if (result) {
      const isPasswordCorrect = await this.validatePassword(result, password);
      if (!isPasswordCorrect)
        return { error: 'incorrect password' };

      return await this.updateRefreshToken(result);
    }

    const info = await this.getPSUInfo(psuPassport, password);
    const { fname, lname } = this.extractPSUInfo(info);

    if (fname.length <= 0)
      return { error: 'user not found' };

    const position = this.getPSUSignType(psuPassport);

    const user = {
      fname,
      lname,
      phoneNumber: '',
      psuPassport,
      email: `${psuPassport}@psu.ac.th`,
      password,
      position,
      dob: new Date(),
      gender: 'M'
    } as User;

    await this.signup(user);
    result = await this.userService.getUserByPSUPassport(psuPassport);

    return await this.updateRefreshToken(result);
  }

  async updateRefreshToken(user: User) {
    //clear old token
    user.refreshToken = null;

    const tokenObj = await this.createToken(JwtPayload.fromModel(user));
    user.refreshToken = tokenObj.accessToken;
    const tokenObj2 = await this.createToken(JwtPayload.fromModel(user));

    const data = {
      userId: user.userId,
      refreshToken: tokenObj.accessToken
    } as User;

    await this.userService.updateUser(data);

    return tokenObj2;
  }

  async signinWithToken(token: string) {
    try {
      const data = this.jwtService.decode(token) as JwtPayload;
      const result = await this.validate(data);
      if (result.error)
        return result;
      const newToken = await this.createToken(JwtPayload.fromModel(result));
      return newToken;
    } catch (e) {
      return { error: 'token error' };
    }
  }

  async signout(token: string) {
    const user = await this.userService.getUserByRefreshToken(token);
    if (user.error)
      return { error: 'user not found' };

    const data = {
      userId: user.userId,
      refreshToken: null
    } as User;

    const result = await this.userService.updateUser(data);
    if (result.error)
      return result;

    return { message: 'sign out success' };
  }

  async checkPositionFromToken(accessToken: string, position: string) {
    const user = await this.validateToken(accessToken) as User;
    if (!user)
      throw new UnauthorizedException();
    return user.position === position;
  }

  async checkAdminFromToken(accessToken: string) {
    const isAdmin = await this.checkPositionFromToken(accessToken, USER_POSITION.ADMIN);
    if (!isAdmin) {
      throw new UnauthorizedException('permission denied');
    }
    return true;
  }

  async checkOwnerFromToken(accessToken: string, booking: Booking) {
    const user = await this.validateToken(accessToken) as User;
    const isOwner = user.userId === booking.userId;
    if (!isOwner)
      throw new UnauthorizedException('permission denied');
  }

  async forgetPassword(phoneNumber: string) {
    const result = await this.userService.getUserByPhoneNumber(phoneNumber);
    if (result.error)
      return result;

    const user = result as User;
    const token = crypto.randomBytes(20).toString('hex');
    user.update({
      resetPasswordToken: token,
      resetPasswordExpires: Date.now() + (360000)
    })

    const [err] = await to(this.sentResetPasswordLink(user, token));

    if (err)
      return { error: err }

    return `already send reset mail to ${user.email}`;
  }

  async resetPassword(resetPasswordToken: string, password: string) {
    const result = await this.userService.getUserByResetToken(resetPasswordToken);

    if (result.error) return result;

    const hashPassword = await bcrypt.hash(password, saltRounds);

    const user = {
      phoneNumber: result.phoneNumber,
      password: hashPassword,
      resetPasswordToken: null,
      resetPasswordExpires: null
    } as User;

    await this.userService.updateUser(user);

    return 'Password reset successful';
  }

  async validateToken(accessToken: string) {
    const payload = this.jwtService.decode(accessToken) as JwtPayload;
    return await this.validate(payload);
  }

  async validate(payload: JwtPayload): Promise<any> {
    if (!payload || !payload.refreshToken) return { error: 'invalid token' };
    return await this.userService.getUserByRefreshToken(payload.refreshToken);
  }

  private async validatePassword(user: User, password: string) {
    if (!user || !password)
      return false;
    return await bcrypt.compare(password, user.password);
  }

  private async createToken(payload: JwtPayload) {
    const accessToken = this.jwtService.sign(payload);
    return {
      expiresAt: moment().add(1, 'month').format(),
      accessToken
    }
  }

  private async sentResetPasswordLink(user, token) {
    const content = {
      subject: 'Reset password link',
      text: `You can reset password on the link below \n 
            ${domainName}/reset_password?token=${token}`,
      html: '',
    }
    return await sendEmail(user.email, content)
  }

  private async getPSUInfo(psuPassport: string, password: string): Promise<any> {
    return new Promise<any>((resolve, reject) => {
      soap.createClient(PSU_URL, (err, client) => {
        if (err) return reject(err);

        let user = {
          username: psuPassport,
          password: password
        }

        client.GetStaffDetails(user, (err, response) => {
          if (err) return reject(err);
          else
            return resolve(response.GetStaffDetailsResult.string);
        })
      })
    })
  }

  private extractPSUInfo(info) {
    return {
      fname: info[1],
      lname: info[2]
    }
  }

  private checkSignType(userInfo: string) {
    return userInfo.startsWith('0') ? SIGNIN_TYPE.PHONE_NUMBER : SIGNIN_TYPE.PSU_PASSPORT;
  }

  private getPSUSignType(psuPassport: string) {
    if (psuPassport.charAt(0).match(/[a-z]/)) {
      return 'staff';
    }

    return 'student';
  }
}
