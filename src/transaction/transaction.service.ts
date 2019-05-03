import { Injectable, Inject } from '@nestjs/common';
import { Transaction } from './model/transaction.model';
import moment from 'moment';

@Injectable()
export class TransactionService {
  constructor(@Inject('transactionRepo') private readonly transaction: typeof Transaction) {}

  async find(transaction: Transaction) {

    const ignoreOffsetTime = transaction.timestamp.toString().slice(0,19) + '.000Z';

    const transactions = await this.transaction.findAll({
      where: {
        accountNumber: transaction.accountNumber.slice(6, 10),
        balance: transaction.balance,
        used: false,
        timestamp: {
          $between: [
            moment(ignoreOffsetTime).subtract(1,'minute').toDate(),
            moment(ignoreOffsetTime).add(1,'minute').toDate()
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

  async findById(transactionId: number) {
    const transaction = await this.transaction.findById(transactionId);
    return transaction;
  }

  async create(transaction: Transaction) {
    return await this.transaction.create(transaction);
  }

  async useTransaction(transactionId: number) {
    const transaction = await this.transaction.findByPk(transactionId);
    if (!transaction) return false;
    return await transaction.update({ used: true });
  }
}
