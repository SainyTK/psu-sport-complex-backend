import {
    AllowNull,
    AutoIncrement,
    Column,
    Model,
    PrimaryKey,
    Table,
} from 'sequelize-typescript';

@Table({
    timestamps: true,
    paranoid: true,
})
export class User extends Model<User> {
    @AllowNull(false)
    @PrimaryKey
    @AutoIncrement
    @Column
    userId: number;

    @AllowNull(false)
    @Column
    firstName: string;

    @AllowNull(false)
    @Column
    lastName: string;

    @AllowNull(false)
    @Column
    userName: string;

    @AllowNull(false)
    @Column
    password: string;
}
