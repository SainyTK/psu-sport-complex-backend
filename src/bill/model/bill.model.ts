import {
    AllowNull,
    AutoIncrement,
    Column,
    Model,
    PrimaryKey,
    Table,
    ForeignKey,
    BelongsTo,
    HasMany,
} from 'sequelize-typescript';
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

    @AllowNull(true)
    @Column
    expiresAt: Date;

    @AllowNull(true)
    @Column
    slipUrl: string;
}