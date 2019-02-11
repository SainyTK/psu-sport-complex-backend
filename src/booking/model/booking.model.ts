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

    @AllowNull(false)
    @ForeignKey(() => User)
    @Column
    userId: number;

    @BelongsTo(() => User)
    user: User;

    @AllowNull(false)
    @ForeignKey(() => Court)
    @Column
    courtId: number;

    @BelongsTo(() => Court)
    court: Court;

    @AllowNull(false)
    @Column
    startTime: Date;

    @AllowNull(false)
    @Column
    finishTime: Date;

    @Default(false)
    @Column
    approved: boolean;
}
