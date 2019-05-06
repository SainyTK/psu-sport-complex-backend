import { Injectable, Inject } from '@nestjs/common';
import { Transaction } from './model/transaction.model';
import moment from 'moment';

@Injectable()
export class TransactionService {
  constructor(@Inject('transactionRepo') private readonly transaction: typeof Transaction) {}

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

  async findById(transactionId: number) {
    const transaction = await this.transaction.findById(transactionId);
    return transaction;
  }

  async create(transaction: Transaction) {
    const t = await this.transaction.find({where: {tid: transaction.tid}});
    if (t)
      return { error: 'Already exist transaction' };
    return await this.transaction.create(transaction);
  }

  async useTransaction(transactionId: number) {
    const transaction = await this.transaction.findByPk(transactionId);
    if (!transaction) return false;
    return await transaction.update({ used: true });
  }
}
