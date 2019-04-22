import { Injectable, Inject, forwardRef } from '@nestjs/common';
import { Bill } from './model/bill.model';
import { BookingService } from '../booking/booking.service';
import { AuthService } from '../authen/auth.service';

@Injectable()
export class BillService {
    constructor(
        @Inject('billRepo') private readonly bill: typeof Bill,
        @Inject(forwardRef(() => BookingService)) private readonly bookingService: BookingService
    ) { }

    async findAll() {
        return await this.bill.findAll();
    }

    async findById(billId: number) {
        return await this.bill.findOne({ where: { billId } })
    }

    async createBill() {
        const bill = await this.bill.create();
        return bill;
    }

    async updateSlip(billId: number, slipUrl: string) {
        const bill = await this.bill.findOne({ where: { billId } });
        bill.slip = slipUrl;

        await this.bill.update({ slip: slipUrl }, { where: { billId: bill.billId } });

        await this.bookingService.approveByBill(billId);

        return await this.bookingService.findByBillId(billId);
    }

    async deleteById(billId: number) {
        const bill = await this.bill.findByPk(billId);
        await bill.destroy();
        return `Deleted bill id ${billId}`;
    }
}
