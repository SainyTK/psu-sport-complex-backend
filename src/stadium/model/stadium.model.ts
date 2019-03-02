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
    stadiumId: number;

    @AllowNull(false)
    @Column
    name: string;

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
}
