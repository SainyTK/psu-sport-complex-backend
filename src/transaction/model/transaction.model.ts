import {
    AllowNull,
    AutoIncrement,
    Column,
    Model,
    PrimaryKey,
    Table,
    Default,
} from 'sequelize-typescript';

@Table
export class Transaction extends Model<Transaction> {
    @AllowNull(false)
    @PrimaryKey
    @AutoIncrement
    @Column
    transactionId: number;

    @AllowNull(true)
    @Column
    account: string;

    @AllowNull(false)
    @Column
    deposit: number;

    @AllowNull(false)
    @Column
    date: Date;

    @AllowNull(false)
    @Default(false)
    @Column
    used: boolean;

    @AllowNull(false)
    @Column
    tid: string;
}
