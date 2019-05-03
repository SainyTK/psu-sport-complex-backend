import { Injectable, Inject, forwardRef } from '@nestjs/common';
import { Bill } from './model/bill.model';
import { BookingService } from '../booking/booking.service';
import { AuthService } from '../authen/auth.service';
import { TransactionService } from '../transaction/transaction.service';
import { Transaction } from '../transaction/model/transaction.model';
import { Booking } from '../booking/model/booking.model';

@Injectable()
export class BillService {
    constructor(
        @Inject('billRepo') private readonly bill: typeof Bill,
        @Inject(forwardRef(() => TransactionService)) private readonly transactionService: TransactionService,
        @Inject(forwardRef(() => BookingService)) private readonly bookingService: BookingService
    ) { }

    async findAll() {
        return await this.bill.findAll({ include: [Booking] });
    }

    async findById(billId: number) {
        return await this.bill.findOne({ where: { billId } })
    }

    async createBill() {
        const bill = await this.bill.create();
        return bill;
    }

    async confirm(billId: number, transaction: Transaction) {
        const bill = await this.findById(billId);
        if (!bill) return { error: 'bill not found' }
        if (bill.transactionId) return { error: 'already confirm' }

        const t = await this.transactionService.find(transaction);
        if (!t) return { error: 'transaction not found' };

        await this.bill.update({ transactionId: t.transactionId }, { where: { billId: bill.billId } });
        await this.transactionService.useTransaction(t.transactionId);
        await this.bookingService.approveByBill(billId);

        return await this.bill.findByPk(billId, { include: [Booking] });
    }

    // async updateSlip(billId: number, slipUrl: string) {
    //     const bill = await this.bill.findOne({ where: { billId } });
    //     bill.slip = slipUrl;

    //     await this.bill.update({ slip: slipUrl }, { where: { billId: bill.billId } });

    //     await this.bookingService.approveByBill(billId);

    //     return await this.bookingService.findByBillId(billId);
    // }

    async deleteById(billId: number) {
        const bill = await this.bill.findByPk(billId);
        await bill.destroy();
        return `Deleted bill id ${billId}`;
    }
}
