import { IsString, IsNumber, IsDateString } from 'class-validator';
import { Transaction } from '../model/transaction.model';

export class TransactionDTO {
    @IsString() accountNumber: string;
    @IsNumber() balance: number;
    @IsDateString() timestamp: Date;

    static toModel(dto: TransactionDTO): Transaction {
        const {
            accountNumber,
            balance,
            timestamp
        } = dto;
        
        const model = {
            accountNumber,
            balance,
            timestamp
        } as Transaction;

        return model;
    }
}