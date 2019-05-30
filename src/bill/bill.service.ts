import { Injectable, Inject, forwardRef, OnModuleDestroy } from '@nestjs/common';
import { Bill } from './model/bill.model';
import { BookingService } from '../booking/booking.service';
import { TransactionService } from '../transaction/transaction.service';
import { Transaction } from '../transaction/model/transaction.model';
import { Booking } from '../booking/model/booking.model';
import moment from 'moment';
import { ModuleRef } from '@nestjs/core';

@Injectable()
export class BillService implements OnModuleDestroy {

    private transactionService: TransactionService;
    
    constructor(
        @Inject('billRepo') private readonly bill: typeof Bill,
        @Inject(forwardRef(() => BookingService)) private readonly bookingService: BookingService,
        private readonly moduleRef: ModuleRef
    ) { }

    onModuleInit() {
        this.transactionService = this.moduleRef.get(TransactionService, { strict: false });
    }

    onModuleDestroy() {}

    async findAll() {
        await this.filterExpired();
        return await this.bill.findAll({ include: [Booking] });
    }

    async findById(billId: number) {
        await this.filterExpired();
        return await this.bill.findOne({ where: { billId } })
    }

    async findByUserId(userId: number) {
        await this.filterExpired();
        return await this.bill.findAll({ 
            where: { userId },
            include: [Booking, Transaction],
            order: [['createdAt', 'DESC']]
        })
    }

    async findByConfirmInfo(account: string, deposit: number, date: Date) {
        const bills = await this.bill.findAll({
            where: {
              // confirmAccount: account.slice(6, 10),
              confirmDeposit: deposit,
              confirmDate: {
                $between: [
                  moment(date).subtract(1, 'minute').toDate(),
                  moment(date).add(1, 'minute').toDate()
                ]
              }
            }
          });
      
          const bill = bills.pop();
      
          if (!bill) return null;
      
          return bill;
    }

    async getMyLastBill(userId: number) {
        await this.filterExpired();
        const bills = await this.findByUserId(userId);
        if (!bills || bills.length <= 0)
            return false;
        return bills[0];
    }

    async createBill(userId: number, fee: number) {
        const expiresAt = moment().add(20, 'minute').toDate();
        const bill = await this.bill.create({ userId, fee, expiresAt });
        return bill;
    }

    async createBillByAdmin(userId: number, fee: number) {
        const bill = await this.bill.create({ userId, fee });
        return bill;
    }

    async confirm(billId: number, transaction: Transaction) {
        const bill = await this.findById(billId);
        if (!bill) return { error: 'Bill not found' }
        if (bill.transactionId) return { error: 'Already confirm' }
        if (bill.fee > transaction.deposit) return { error: 'Too low money'};

        await bill.update({
            confirmAccount: transaction.account,
            confirmDeposit: transaction.deposit,
            confirmDate: transaction.date
        });

        const t = await this.transactionService.find(transaction);
        if (!t) return { error: 'transaction not found' };

        await bill.update({ transactionId: t.transactionId, expiresAt: null });
        await this.transactionService.useTransaction(t.transactionId);
        await this.bookingService.approveByBill(billId);

        return await this.bill.findByPk(billId, { include: [Booking] });
    }

    async deleteById(billId: number) {
        const bill = await this.bill.findByPk(billId);
        await bill.destroy();
        return `Deleted bill id ${billId}`;
    }

    private async filterExpired() {
        const bills = await this.bill.findAll({ where: { transactionId: null } });
    
        for(let bill of bills) {
          if (moment().isAfter(bill.expiresAt))
            await this.deleteById(bill.billId);
        }
      }
}
