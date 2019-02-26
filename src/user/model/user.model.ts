import {
    AllowNull,
    AutoIncrement,
    Column,
    Model,
    PrimaryKey,
    Table,
    Default,
} from 'sequelize-typescript';
import { position } from '../enum/user.position';

@Table({
    timestamps: true,
    paranoid: true,
    updatedAt: 'last_modified'
})
export class User extends Model<User> {
    @AllowNull(false)
    @PrimaryKey
    @AutoIncrement
    @Column({field: 'user_id'})
    userId: number;

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
    @Default(position.GENERAL_PUBLIC)
    @Column
    position: position;

    @AllowNull(false)
    @Column
    dob: Date;

    @AllowNull(false)
    @Column
    gender: 'M'|'F';

    @AllowNull(false)
    @Column({field: 'timezone_offset'})
    timezoneOffset: number;

    @AllowNull(false)
    @Column
    language: string;
}
