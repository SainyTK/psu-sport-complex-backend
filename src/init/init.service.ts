import { Injectable } from '@nestjs/common';
import * as fs from 'fs';
import { StadiumService } from '../stadium/stadium.service';
import { Stadium } from '../stadium/model/stadium.model';
import { User } from '../user/model/user.model';
import { AuthService } from '../authen/auth.service';

@Injectable()
export class InitService {
  constructor(
    private readonly authService: AuthService,
    private readonly stadiumService: StadiumService,
  ) { }

  async initData() {
    const stadiums = await this.getInitStadiums();
    const users = await this.getInitUsers();

    const isExist = await this.stadiumService.findAll();

    users.forEach((user: User) => {
      this.authService.signup(user)
    });

    if (isExist.length <= 0) {

      stadiums.forEach((stadium: Stadium) => {
        this.stadiumService.insert(stadium)
      });

      return 'Initialize success';
    }

    return 'Data exist';
  }

  async getInitUsers() {
    return new Promise<User[]>((resolve, reject) => {
      fs.readFile(`${__dirname}/../../file/user.json`, (err, data) => {
        if (err)
          reject(err);
        else
          resolve(JSON.parse(data.toString()));
      })
    })
  }

  async getInitStadiums() {
    return new Promise<Stadium[]>((resolve, reject) => {
      fs.readFile(`${__dirname}/../../file/stadium.json`, (err, data) => {
        console.log(err);
        console.log(data);
        if (err)
          reject(err);
        else
          resolve(JSON.parse(data.toString()));
      })
    })
  }
}
