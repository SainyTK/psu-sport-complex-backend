import { User } from 'src/user/model/user.model';
import { IsString, IsNumber, IsDateString } from 'class-validator';

export class SignupDTO {
    @IsString() firstname: string;
    @IsString() lastname: string;
    @IsString() username: string;
    @IsString() email: string;
    @IsString() password: string;
    @IsDateString() dob: Date;
    @IsString() gender: 'M'|'F';
    @IsNumber() timezone_offset: number;
    @IsString() language: string;

    public static toUser(dto: SignupDTO): User {
        const user = {
            fname: dto.firstname,
            lname: dto.lastname,
            username: dto.username,
            email: dto.email,
            password: dto.password,
            dob: dto.dob,
            gender: dto.gender,
            timezone_offset: dto.timezone_offset,
            language: dto.language
        }
        return user as User;
    }
}