import {
    AllowNull,
    AutoIncrement,
    Column,
    Model,
    PrimaryKey,
    Table,
} from 'sequelize-typescript';

@Table
export class Stadium extends Model<Stadium> {
    @AllowNull(false)
    @PrimaryKey
    @AutoIncrement
    @Column
    stadium: number;

    @AllowNull(false)
    @Column
    stadiumName: string;
}
