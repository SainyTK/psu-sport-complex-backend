import {
    AllowNull,
    AutoIncrement,
    Column,
    Model,
    PrimaryKey,
    Table,
    Default
} from 'sequelize-typescript';

@Table({
    timestamps: true,
    paranoid: true,
})
export class Blackout extends Model<Blackout> {
    @AllowNull(false)
    @PrimaryKey
    @AutoIncrement
    @Column
    blackoutId: number;

    @AllowNull(false)
    @Column
    start: Date;

    @AllowNull(false)
    @Column
    end: Date;

    @AllowNull(true)
    @Default('')
    @Column
    title: string;

    @AllowNull(true)
    @Default('')
    @Column
    detail: string;
}