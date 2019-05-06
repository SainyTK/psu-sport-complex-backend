import { IsString, IsNumber, IsDateString } from 'class-validator';
import { Transaction } from '../model/transaction.model';

export class TransactionDTO {
    @IsString() accountNumber: string;
    @IsNumber() balance: number;
    @IsDateString() timestamp: Date;
    @IsString() tid: String;

    static toModel(dto: TransactionDTO): Transaction {
        const {
            accountNumber,
            balance,
            timestamp,
            tid
        } = dto;
        
        const model = {
            accountNumber,
            balance,
            timestamp,
            tid
        } as Transaction;

        return model;
    }
}