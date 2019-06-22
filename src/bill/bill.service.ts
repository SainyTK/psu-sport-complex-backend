import { Injectable, Inject, forwardRef, OnModuleDestroy } from '@nestjs/common';
import { Bill } from './model/bill.model';
import { BookingService } from '../booking/booking.service';
import { TransactionService } from '../transaction/transaction.service';
import { Transaction } from '../transaction/model/transaction.model';
import { Booking } from '../booking/model/booking.model';
import moment from 'moment';
import { ModuleRef } from '@nestjs/core';
import { BillGateway } from './bill.gateway';
import { sendEmail } from '../common/utils/sendmail-utils';
import domain from '../config/domain.config';
import { fanpageUrl } from '../config';
import { User } from '../user/model/user.model';

const BILL_EXPIRES = 20;

@Injectable()
export class BillService implements OnModuleDestroy {

    private transactionService: TransactionService;

    constructor(
        @Inject('billRepo') private readonly bill: typeof Bill,
        @Inject(forwardRef(() => BookingService)) private readonly bookingService: BookingService,
        private readonly gateway: BillGateway,
        private readonly moduleRef: ModuleRef
    ) { }

    onModuleInit() {
        this.transactionService = this.moduleRef.get(TransactionService, { strict: false });
    }

    onModuleDestroy() { }

    async findAll() {
        await this.filterExpired();
        return await this.bill.findAll({ include: [Booking] });
    }

    async findById(billId: number) {
        await this.filterExpired();
        return await this.bill.findOne({ where: { billId }, include: [Booking, User] })
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
        const expiresAt = moment().add(BILL_EXPIRES, 'minute').toDate();
        const bill = await this.bill.create({ userId, fee, expiresAt });
        return bill;
    }

    async createBillByAdmin(userId: number, fee: number) {
        const bill = await this.bill.create({ userId, fee });
        return bill;
    }

    async confirm(billId: number, transaction: Transaction) {
        const bill = await this.findById(billId);
        if (!bill) return { error: 'bill not found' }
        if (bill.transactionId) return { error: 'already confirm' }
        if (bill.fee > transaction.deposit) return { error: 'too low money' };

        await bill.update({
            expiresAt: moment().add(BILL_EXPIRES, 'minute').toDate(),
            confirmAccount: transaction.account,
            confirmDeposit: transaction.deposit,
            confirmDate: transaction.date
        });

        const t = await this.transactionService.find(transaction);
        if (!t) return { error: 'transaction not found' };

        await this.approveBill(bill, t);

        return await this.bill.findByPk(billId, { include: [Booking] });
    }

    private async approveBill(bill: Bill, t: Transaction) {
        await bill.update({ transactionId: t.transactionId, expiresAt: null });
        await this.transactionService.useTransaction(t.transactionId);
        await this.bookingService.approveByBill(bill.billId);
        this.sendApprovedEmail(bill);
    }

    async deleteById(billId: number) {
        const bill = await this.bill.findByPk(billId);
        if (!bill)
            return { error: 'bill not found' };
        await bill.destroy();
        return `deleted bill id ${billId}`;
    }

    async filterExpired() {
        const bills = await this.bill.findAll({
            where: {
                transactionId: null,
                expiresAt: {
                    $lte: moment().toDate()
                }
            },
            include: [User]
        });

        bills.forEach(async (bill) => {
            if (bill) {
                await this.bookingService.deleteByBillId(bill.billId);
                await this.deleteById(bill.billId);
                this.gateway.server.emit('bookingRejected', bill);
                this.sendRejectedEmail(bill);
            }
        });

    }

    async sendApprovedEmail(bill: Bill) {
        const { owner, bookings } = bill;
        const { bookingId } = bookings[0];
        const booking = await this.bookingService.findById(bookingId);
        const { startDate, stadium } = booking;

        const date = moment(startDate).format('DD-MM-YYYY');

        const content = {
            subject: `Your bookings have already approved`,
            text: `You can check your booking at ${domain}/booking?sport=${stadium.name}&date=${date}`,
            html: ``
        }
        return await sendEmail(owner.email, content);
    }

    async sendRejectedEmail(bill: Bill) {
        const { owner } = bill;

        const content = {
            subject: `Your bookings have been rejected`,
            text: ``,
            html: `Please contact to <a href='${fanpageUrl}'>sport complex fanpage</a> and send your payment slip`
        }
        return await sendEmail(owner.email, content);
    }

}
