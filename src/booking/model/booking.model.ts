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
import { Court } from '../../court/model/court.model';
import { BOOKING_STATUS } from '../constant/booking-status';

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

    @ForeignKey(() => Court)
    @AllowNull(false)
    @Column
    courtId: number;

    @BelongsTo(() => Court)
    court: Court;

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
