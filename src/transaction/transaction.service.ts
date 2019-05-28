import { Injectable, Inject, forwardRef, OnModuleInit } from '@nestjs/common';
import { Transaction } from './model/transaction.model';
import moment from 'moment';
import { TransactionGateway } from './transaction.gateway';
import { BillService } from '../bill/bill.service';
import { ModuleRef } from '@nestjs/core';

const TIMEOUT_SEC = 1000 * 30;

@Injectable()
export class TransactionService implements OnModuleInit {

  private serviceWorking = false;
  private timeout;
  private lastOnlineDate = moment();

  private billService: BillService;

  constructor(
    @Inject('transactionRepo') private readonly transaction: typeof Transaction,
    private readonly moduleRef: ModuleRef,
    private readonly gateway: TransactionGateway,
  ) { }

  onModuleInit() {
    this.billService = this.moduleRef.get(BillService, { strict: false });
  }

  onModuleDestroy() { }

  async find(transaction: Transaction) {

    // const ignoreOffsetTime = transaction.date.toString().slice(0,19) + '.000Z';

    const transactions = await this.transaction.findAll({
      where: {
        // account: transaction.account.slice(6, 10),
        deposit: transaction.deposit,
        used: false,
        date: {
          $between: [
            moment(transaction.date).subtract(1, 'minute').toDate(),
            moment(transaction.date).add(1, 'minute').toDate()
          ]
        }
      }
    });

    const t = transactions.pop();

    if (!t) return null;

    return t;
  }

  async findAll() {
    return await this.transaction.findAll();
  }

  async findUnused() {
    const transactions = await this.transaction.findAll({ where: { used: false } });
    return transactions;
  }

  async findById(transactionId: number) {
    const transaction = await this.transaction.findById(transactionId);
    return transaction;
  }

  async findMemberTransactions() {
    const transactions = await this.transaction.findAll({ where: { tid: 'create member' } });
    return transactions;
  }

  async create(transaction: Transaction) {
    this.updateSCBServiceStatus();

    const t = await this.transaction.find({ where: { tid: transaction.tid } });
    if (t)
      return { error: 'Already exist transaction' };

    const { account, deposit, date } = transaction;
    const unApprovedBill = await this.billService.findByConfirmInfo(account, deposit, date);
    if (!unApprovedBill)
      return false;

    const newTrans = await this.transaction.create(transaction) as Transaction;

    await this.billService.confirm(unApprovedBill.billId, newTrans);

    return await this.transaction.create(transaction);
  }

  async createMemberTransaction(amount: number) {
    const t = {
      account: 'create memner',
      deposit: amount,
      date: moment().toDate(),
      used: true,
      tid: 'create member'
    } as Transaction;

    return await this.transaction.create(t);
  }

  async useTransaction(transactionId: number) {
    const transaction = await this.transaction.findByPk(transactionId);
    if (!transaction) return false;
    return await transaction.update({ used: true });
  }

  async getSCBServiceStatus() {
    const res = {
      serviceWorking: this.serviceWorking,
      lastOnlineDate: this.lastOnlineDate.fromNow()
    };

    return res;
  }

  private async updateSCBServiceStatus() {
    clearTimeout(this.timeout);

    this.timeout = setTimeout(() => {
      this.serviceWorking = false;
      this.emitSCBServiceStatus(false, this.lastOnlineDate);
    }, TIMEOUT_SEC);

    if (!this.serviceWorking) {
      this.emitSCBServiceStatus(true, moment());
    }
    this.serviceWorking = true;
    this.lastOnlineDate = moment();

    console.log({
      working: this.serviceWorking,
      lastOnline: this.lastOnlineDate
    })
  }

  private emitSCBServiceStatus(working, lastOnline) {
    this.gateway.server.emit('scb', {
      serviceWorking: working,
      lastOnlineDate: lastOnline.fromNow()
    })
  }
}
