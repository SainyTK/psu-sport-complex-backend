import {
    AllowNull,
    AutoIncrement,
    Column,
    Model,
    PrimaryKey,
    Table,
    ForeignKey,
    BelongsTo,
} from 'sequelize-typescript';
import { Stadium } from 'src/stadium/model/stadium.model';

@Table
export class Court extends Model<Court> {
    @AllowNull(false)
    @PrimaryKey
    @AutoIncrement
    @Column
    courtId: number;

    @AllowNull(false)
    @Column
    courtName: string;

    @ForeignKey(() => Stadium)
    @AllowNull(false)
    @Column
    stadiumId: number;

    @BelongsTo(() => Stadium)
    stadium: Stadium;
}
