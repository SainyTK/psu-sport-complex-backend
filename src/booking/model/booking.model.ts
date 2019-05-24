import {
    AllowNull,
    AutoIncrement,
    Column,
    Model,
    PrimaryKey,
    ForeignKey,
    Table,
    BelongsTo,
    Default,
} from 'sequelize-typescript';
import { User } from '../../user/model/user.model';
import { BOOKING_STATUS } from '../constant/booking-status';
import { Stadium } from '../../stadium/model/stadium.model';
import { Bill } from '../../bill/model/bill.model';
import { USER_POSITION } from 'src/user/constant/user-position';

@Table({
    timestamps: true,
    paranoid: true,
})
export class Booking extends Model<Booking> {
    @AllowNull(false)
    @PrimaryKey
    @AutoIncrement
    @Column
    bookingId: number;

    @AllowNull(true)
    @Column
    title: string;

    @AllowNull(true)
    @Column
    description: string;

    @AllowNull(false)
    @Column
    fee: number;

    @AllowNull(false)
    @Default(BOOKING_STATUS.UNPAID)
    @Column
    status: string;

    @AllowNull(true)
    @ForeignKey(() => User)
    @Column
    userId: number;

    @BelongsTo(() => User)
    user: User;

    @AllowNull(true)
    @Default('')
    @Column
    ownerName: string;

    @AllowNull(true)
    @Column
    ownerInfo: string;

    @AllowNull(true)
    @Default(USER_POSITION.GENERAL_PUBLIC)
    @Column
    ownerPosition: string;

    @ForeignKey(() => Bill)
    @AllowNull(true)
    @Column
    billId: number;

    @BelongsTo(() => Bill)
    bill: Bill;

    @ForeignKey(() => Stadium)
    @AllowNull(false)
    @Column
    stadiumId: number;

    @BelongsTo(() => Stadium)
    stadium: Stadium;

    @AllowNull(false)
    @Column
    courtId: number;

    @AllowNull(false)
    @Column
    startDate: Date;

    @AllowNull(false)
    @Column
    endDate: Date;
}
