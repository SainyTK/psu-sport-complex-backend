import { Bill } from './model/bill.model';

export const BillProviders = [
    {
        provide: 'billRepo',
        useValue: Bill,
    },
];
