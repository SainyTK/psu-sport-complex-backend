import {
    AllowNull,
    AutoIncrement,
    Column,
    Model,
    PrimaryKey,
    Table,
    Default,
} from 'sequelize-typescript';

@Table
export class Stadium extends Model<Stadium> {
    @AllowNull(false)
    @PrimaryKey
    @AutoIncrement
    @Column
    stadiumId: number;

    @AllowNull(false)
    @Column
    name: string;

    @AllowNull(false)
    @Column
    numCourt: number;

    @AllowNull(false)
    @Column
    costPublic: number;

    @AllowNull(false)
    @Column
    costMember: number;

    @AllowNull(false)
    @Column
    costStudent: number;

    @AllowNull(false)
    @Column
    costStaff: number;

    @AllowNull(false)
    @Default('00:00')
    @Column
    openAfter: string;

    @AllowNull(false)
    @Default('00:00')
    @Column
    closeBefore: string;

    @AllowNull(false)
    @Default(false)
    @Column
    canBook: boolean;
}
