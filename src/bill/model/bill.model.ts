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

    @HasMany(() => Booking)
    bookings: Booking[];

    @ForeignKey(() => Transaction)
    @AllowNull(true)
    @Default(null)
    @Column
    transactionId: number;

    @BelongsTo(() => Transaction, { foreignKey: { allowNull: true }})
    transaction: Transaction;

}