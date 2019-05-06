import { IsString, IsNumber, IsDateString } from 'class-validator';
import { Transaction } from '../../transaction/model/transaction.model';

export class ConfirmBillDTO {
    @IsString() account: string;
    @IsNumber() deposit: number;
    @IsDateString() date: Date;

    static toTransactionModel(dto: ConfirmBillDTO): Transaction {
        const {
            account,
            deposit,
            date,
        } = dto;
        
        const model = {
            account,
            deposit,
            date
        } as Transaction;

        return model;
    }
}