import { Injectable, Inject } from '@nestjs/common';
import * as courtData from '../../seedData/court.json';
import * as stadiumData from '../../seedData/stadium.json';
import { CourtService } from '../court/court.service';
import { StadiumService } from '../stadium/stadium.service';
import { Stadium } from '../stadium/model/stadium.model';
import { Court } from '../court/model/court.model';

@Injectable()
export class InitService {
  constructor(
    private readonly courtService: CourtService,
    private readonly stadiumService: StadiumService,
    ){}

  async initData() {
    const stadiums = stadiumData['default'];
    const courts = courtData['default'];
    stadiums.forEach((stadium: Stadium) => {
      this.stadiumService.insert(stadium)
    });
    courts.forEach((court: Court) => {
      this.courtService.insert(court);
    })
  }
}
