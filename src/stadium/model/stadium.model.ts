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
    @Column({field: 'stadium_id'})
    stadiumId: number;

    @AllowNull(false)
    @Column
    name: string;

    @AllowNull(false)
    @Column({field: 'cost_public'})
    costPublic: number;

    @AllowNull(false)
    @Column({field: 'cost_member'})
    costMember: number;

    @AllowNull(false)
    @Column({field: 'cost_student'})
    costStudent: number;

    @AllowNull(false)
    @Column({field: 'cost_staff'})
    costStaff: number;
}
