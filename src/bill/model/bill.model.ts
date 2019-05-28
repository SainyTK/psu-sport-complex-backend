import {
    AllowNull,
    AutoIncrement,
    Column,
    Model,
    PrimaryKey,
    Table,
    Default,
    ForeignKey,
    BelongsTo,
    HasMany,
} from 'sequelize-typescript';
import { Transaction } from '../../transaction/model/transaction.model';
import { Booking } from '../../booking/model/booking.model';
import { User } from '../../user/model/user.model';

@Table({
    timestamps: true,
    paranoid: true,
})
export class Bill extends Model<Bill> {
    @AllowNull(false)
    @PrimaryKey
    @AutoIncrement
    @Column
    billId: number;

    @AllowNull(false)
    @Column
    fee: number;

    @ForeignKey(() => User)
    @AllowNull(false)
    @Column
    userId: number;

    @BelongsTo(() => User)
    owner: User;

    @HasMany(() => Booking)
    bookings: Booking[];

    @ForeignKey(() => Transaction)
    @AllowNull(true)
    @Default(null)
    @Column
    transactionId: number;

    @BelongsTo(() => Transaction, { foreignKey: { allowNull: true }})
    transaction: Transaction;

    //solve scb service
    @AllowNull(true)
    @Column
    confirmAccount: string;

    @AllowNull(true)
    @Column
    confirmDeposit: number;

    @AllowNull(true)
    @Column
    confirmDate: Date;

    @AllowNull(true)
    @Column
    expiresAt: Date;

    @AllowNull(true)
    @Column
    slipUrl: string;
}