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
import { Stadium } from 'src/stadium/model/stadium.model';

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
    @Default(BOOKING_STATUS.UNPAID)
    @Column
    status: string;

    @ForeignKey(() => User)
    @AllowNull(false)
    @Column
    userId: number;

    @BelongsTo(() => User)
    owner: User;

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

    @Default('')
    @Column
    slip: string;
}
