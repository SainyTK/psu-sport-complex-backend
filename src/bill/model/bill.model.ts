import {
    AllowNull,
    AutoIncrement,
    Column,
    Model,
    PrimaryKey,
    Table,
    Default,
} from 'sequelize-typescript';

@Table({
    timestamps: true,
    paranoid: true,
})
export class Bill extends Model<Bill> {
    @AllowNull(false)
    @PrimaryKey
    @AutoIncrement
    @Column
    billId: number;

    @Default('')
    @Column
    slip: string;
}
