import { User } from 'src/user/model/user.model';

export class JwtPayload {
    firstname: string;
    lastname: string;
    username: string;
    email: string;
    dob: Date;
    gender: 'M' | 'F';
    timezone_offset: number;
    language: string;

    public static fromModel(user: User) {
        const payload = {
            firstname: user.fname,
            lastname: user.lname,
            username: user.username,
            email: user.email,
            dob: user.dob,
            gender: user.gender,
            timezone_offset: user.timezone_offset,
            language: user.language
        }

        return payload as JwtPayload;
    }
}