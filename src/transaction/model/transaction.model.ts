import {
    AllowNull,
    AutoIncrement,
    Column,
    Model,
    PrimaryKey,
    Table,
    ForeignKey,
    BelongsTo,
    Default,
    NotNull
} from 'sequelize-typescript';
import { Bill } from '../../bill/model/bill.model';

@Table
export class Transaction extends Model<Transaction> {
    @AllowNull(false)
    @PrimaryKey
    @AutoIncrement
    @Column
    transactionId: number;

    @AllowNull(false)
    @Column
    accountNumber: string;

    @AllowNull(false)
    @Column
    balance: number;

    @AllowNull(false)
    @Column
    timestamp: Date;

    @AllowNull(false)
    @Default(false)
    @Column
    used: boolean;

    @AllowNull(false)
    @Column
    tid: string;
}
