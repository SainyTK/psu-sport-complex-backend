import {
    AllowNull,
    AutoIncrement,
    Column,
    Model,
    PrimaryKey,
    Table,
    Default,
    DataType
} from 'sequelize-typescript';
import { USER_POSITION } from '../constant/user-position';

const { GENERAL_PUBLIC } = USER_POSITION;

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

    @AllowNull(true)
    @Column
    psuPassport: string;

    @AllowNull(false)
    @Column
    email: string;

    @AllowNull(false)
    @Column
    fname: string;

    @AllowNull(false)
    @Column
    lname: string;

    @AllowNull(false)
    @Column
    password: string;

    @AllowNull(false)
    @Default(GENERAL_PUBLIC)
    @Column
    position: string;

    @AllowNull(true)
    @Default(null)
    @Column
    memberStart: Date;

    @AllowNull(true)
    @Default(null)
    @Column
    memberEnd: Date;

    @AllowNull(false)
    @Column
    dob: Date;

    @AllowNull(false)
    @Column
    gender: 'M' | 'F';

    @AllowNull(true)
    @Default(null)
    @Column({type: DataType.STRING(1023)})
    refreshToken: string;

    @AllowNull(true)
    @Default(null)
    @Column
    resetPasswordToken: string;

    @AllowNull(true)
    @Default(null)
    @Column
    resetPasswordExpires: Date;
}
