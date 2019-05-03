import { Transaction } from './model/transaction.model';

export const TransactionProviders = [
    {
        provide: 'transactionRepo',
        useValue: Transaction,
    },
];
