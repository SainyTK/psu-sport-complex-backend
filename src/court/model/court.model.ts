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
import { Stadium } from '../../stadium/model/stadium.model';

@Table
export class Court extends Model<Court> {
    @AllowNull(false)
    @PrimaryKey
    @AutoIncrement
    @Column
    courtId: number;

    @AllowNull(false)
    @Column
    name: string;

    @ForeignKey(() => Stadium)
    @AllowNull(false)
    @Column
    stadiumId: number;

    @BelongsTo(() => Stadium)
    stadium: Stadium;
}
