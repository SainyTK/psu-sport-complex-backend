import { Injectable } from '@nestjs/common';
import * as stadiumData from '../seedData/stadium.json';
import * as userData from '../seedData/user.json';
import { StadiumService } from '../stadium/stadium.service';
import { Stadium } from '../stadium/model/stadium.model';
import { User } from '../user/model/user.model';
import { AuthService } from '../authen/auth.service';

@Injectable()
export class InitService {
  constructor(
    private readonly authService: AuthService,
    private readonly stadiumService: StadiumService,
    ){}

  async initData() {
    const stadiums = stadiumData['default'];
    const users = userData['default'];

    const isExist = await this.stadiumService.findAll();

    if (isExist.length <= 0) {
      users.forEach((user: User) => {
        this.authService.signup(user)
      });
  
      stadiums.forEach((stadium: Stadium) => {
        this.stadiumService.insert(stadium)
      });

      return 'Initialize success';
    }

    return 'Data exist';
  }
}
