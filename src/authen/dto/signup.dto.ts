import { User } from '../../user/model/user.model';
import { IsString, IsNumber, IsDateString } from 'class-validator';

export class SignupDTO {
    @IsString() fname: string;
    @IsString() lname: string;
    @IsString() phoneNumber: string;
    @IsString() email: string;
    @IsString() password: string;
    @IsDateString() dob: Date;
    @IsString() gender: 'M'|'F';

    public static toUser(dto: SignupDTO): User {
        const user = {
            fname: dto.fname,
            lname: dto.lname,
            phoneNumber: dto.phoneNumber,
            email: dto.email,
            psuPassport: '',
            password: dto.password,
            dob: dto.dob,
            gender: dto.gender,
        }
        return user as User;
    }
}