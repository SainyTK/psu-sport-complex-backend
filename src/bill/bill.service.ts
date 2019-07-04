import { Injectable, Inject, forwardRef } from '@nestjs/common';
import { Bill } from './model/bill.model';
import { BookingService } from '../booking/booking.service';
import { Transaction } from '../transaction/model/transaction.model';
import { Booking } from '../booking/model/booking.model';
import moment from 'moment';
import { BillGateway } from './bill.gateway';
import { sendEmail } from '../common/utils/sendmail-utils';
import domain from '../config/domain.config';
import { fanpageUrl } from '../config';
import { User } from '../user/model/user.model';
import { BOOKING_STATUS } from '../booking/constant/booking-status';

const BILL_EXPIRES = 20;

@Injectable()
export class BillService {

    constructor(
        @Inject('billRepo') private readonly bill: typeof Bill,
        @Inject(forwardRef(() => BookingService)) private readonly bookingService: BookingService,
        private readonly gateway: BillGateway
    ) { }

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

    async confirm(billId: number, slipUrl: string) {
        const bill = await this.findById(billId);
        if (!bill) return { error: 'bill not found' }
        if (bill.slipUrl) return { error: 'already confirm' }

        await bill.update({
            expiresAt: null,
            slipUrl
        });

        await this.bookingService.confirmByBillId(billId);

        return await this.bill.findByPk(billId, { include: [Booking] });
    }

    async approve(billId: number) {
        const bill = await this.findById(billId);
        if (!bill) return { error: 'bill not found' }
        if (bill.bookings[0].status === BOOKING_STATUS.APPROVED) return { error: 'already approved' }

        await this.bookingService.approveByBill(billId);

        return await this.bill.findByPk(billId, { include: [Booking] });
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
                slipUrl: null,
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
