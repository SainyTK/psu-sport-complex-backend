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
import { User } from 'src/user/model/user.model';
import { Court } from 'src/court/model/court.model';
import { BOOKING_STATUS } from '../constant/booking-status';

@Table({
    timestamps: true,
    paranoid: true,
})
export class Booking extends Model<Booking> {
    @AllowNull(false)
    @PrimaryKey
    @AutoIncrement
    @Column({field: 'booking_id'})
    bookingId: number;

    @AllowNull(true)
    @Column
    title: string;

    @AllowNull(true)
    @Column
    description: string;

    @AllowNull(false)
    @Default(BOOKING_STATUS.UNPAID)
    @Column({field: 'status_id'})
    status: string;

    @ForeignKey(() => User)
    @AllowNull(false)
    @Column({field: 'user_id'})
    userId: number;

    @BelongsTo(() => User)
    owner: User;

    @ForeignKey(() => Court)
    @AllowNull(false)
    @Column({field: 'court_id'})
    courtId: number;

    @BelongsTo(() => Court)
    court: Court;

    @AllowNull(false)
    @Column({field: 'start_date'})
    startDate: Date;

    @AllowNull(false)
    @Column({field: 'end_date'})
    endDate: Date;

    @Default(false)
    @Column
    slip: boolean;
}
