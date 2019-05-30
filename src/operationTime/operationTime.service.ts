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

    async checkAvailableDate(startDate, endDate) {
        const passed = this.checkPassed(startDate, endDate);
        if (passed) return passed;

        const noService = await this.checkNoService(startDate, endDate);
        if (noService) return noService;

        const inBlackout = await this.checkBlackout(startDate, endDate);
        if (inBlackout) return inBlackout;

        return false;
    }

    checkPassed(startDate, endDate) {
        const now = moment();
        const mStart = moment(startDate);
        const mEnd = moment(endDate);

        if (mStart.diff(now) <= 0 || mEnd.diff(now) <= 0)
            return `Passed date`;
        return false;
    }

    private async checkNoService(startDate, endDate) {
        const mStart = moment(startDate);
        const mEnd = moment(endDate);

        const operationTimes = await this.getOperationTimes();

        const opTimeStart = operationTimes[mStart.format('dddd')];
        const opTimeEnd = operationTimes[mEnd.format('dddd')];

        if (!opTimeStart)
            return `No service on ${mStart.format('dddd')}s`;
        if (!opTimeEnd)
            return `No service on ${mEnd.format('dddd')}s`;

        const outTimeStart = this.checkOperationTime(opTimeStart, startDate);
        const outTimeEnd = this.checkOperationTime(opTimeStart, endDate);

        if (outTimeStart)
            return outTimeStart;
        
        if (outTimeEnd)
            return outTimeEnd;

        return false;

    }

    private checkOperationTime(operationTime, date) {
        const mDate = moment(date).second(0).millisecond(0);

        if (!operationTime)
            return `No service`;

        const { start, end } = operationTime;
        const [startHr, startMin] = start.split(':').map((t) => parseInt(t));
        const [endHr, endMin] = end.split(':').map((t) => parseInt(t));

        const startOpDate = mDate.clone().hour(startHr).minute(startMin).second(0).millisecond(0);
        const endOpDate = mDate.clone().hour(endHr).minute(endMin).second(0).millisecond(0);

        const inOperationTime = mDate.isBetween(startOpDate, endOpDate) || mDate.isSame(startOpDate) || mDate.isSame(endOpDate);

        if (!inOperationTime)
            return `Not in operation time`;

        return false;
    }

    private async checkBlackout(startDate, endDate) {
        const mStart = moment(startDate);
        const mEnd = moment(endDate);

        const blackouts = await this.findAllBlackout();

        const b = blackouts.find((blackout) => {
            const mBStart = moment(blackout.start);
            const mBEnd = moment(blackout.end);
            const isOnStart = mStart.isBetween(mBStart, mBEnd);
            const isOnEnd = mEnd.isBetween(mBStart, mBEnd);
            return isOnStart && isOnEnd;
        });

        if (b)
            return `${b.title}, No service`;

        return false;
    }
}
