import { User } from '../../user/model/user.model';
import { IsString, IsNumber, IsDateString } from 'class-validator';

export class SignupDTO {
    @IsString() fname: string;
    @IsString() lname: string;
    @IsString() phoneNumber: string;
    @IsString() password: string;
    @IsDateString() dob: Date;
    @IsString() gender: 'M'|'F';
    @IsNumber() timezoneOffset: number;
    @IsString() language: string;

    public static toUser(dto: SignupDTO): User {
        const user = {
            fname: dto.fname,
            lname: dto.lname,
            phoneNumber: dto.phoneNumber,
            password: dto.password,
            dob: dto.dob,
            gender: dto.gender,
            timezoneOffset: dto.timezoneOffset,
            language: dto.language
        }
        return user as User;
    }
}