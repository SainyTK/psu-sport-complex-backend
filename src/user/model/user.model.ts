import {
    AllowNull,
    AutoIncrement,
    Column,
    Model,
    PrimaryKey,
    Table,
    Default,
} from 'sequelize-typescript';
import { USER_POSITION } from '../constant/user-position';

@Table({
    timestamps: true,
    paranoid: true,
    updatedAt: 'last_modified'
})
export class User extends Model<User> {
    @AllowNull(false)
    @PrimaryKey
    @AutoIncrement
    @Column
    userId: number;

    @AllowNull(false)
    @Column
    phoneNumber: string;

    @AllowNull(false)
    @Column
    fname: string;

    @AllowNull(false)
    @Column
    lname: string;

    @AllowNull(false)
    @Column
    username: string;

    @AllowNull(false)
    @Column
    email: string;

    @AllowNull(false)
    @Column
    password: string;

    @AllowNull(false)
    @Default(USER_POSITION.GENERAL_PUBLIC)
    @Column
    position: string;

    @AllowNull(false)
    @Column
    dob: Date;

    @AllowNull(false)
    @Column
    gender: 'M'|'F';

    @AllowNull(false)
    @Column
    timezoneOffset: number;

    @AllowNull(false)
    @Column
    language: string;
}
