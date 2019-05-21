import { Injectable, Inject } from '@nestjs/common';
import { Blackout } from './model/blackout.model';
import { Booking } from '../booking/model/booking.model';
import * as fs from 'fs';
import moment from 'moment';

@Injectable()
export class OperationTimeService {
    constructor(
        @Inject('blackoutRepo') private readonly blackout: typeof Blackout,
    ) { }

    async findAllBlackout() {
        return await this.blackout.findAll();
    }

    async createBlackout(data: Blackout) {
        return await this.blackout.create(data);
    }

    async deleteBlackout(blackoutId: number) {
        const blackout = await this.blackout.findByPk(blackoutId);

        if (!blackout)
            return false;
        
        await blackout.destroy();
        return 'delete successful';
    }

    async getOperationTimes() {
        return new Promise((resolve, reject) => {
            fs.readFile(`${__dirname}/../../file/optime.json`, (err, data) => {
                if (err)
                    reject(err);
                else
                    resolve(JSON.parse(data.toString()));
            });
        })
    }

    async setOperationTimes(data) {
        return new Promise((resolve, reject) => {
            fs.writeFile(`${__dirname}/../../file/optime.json`, JSON.stringify(data), (err) => {
                if (err)
                    reject(err);
                else   
                    resolve(data);
            })
        })
    }
}
