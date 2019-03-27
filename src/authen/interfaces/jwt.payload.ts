import { User } from '../../user/model/user.model';

export class JwtPayload {
    userId: number;
    fname: string;
    lname: string;
    username: string;
    email: string;
    dob: Date;
    gender: 'M' | 'F';
    timezoneOffset: number;
    language: string;

    public static fromModel(user) {
        const payload = {
            userId: user.userId,
            fname: user.fname,
            lname: user.lname,
            username: user.username,
            email: user.email,
            dob: user.dob,
            gender: user.gender,
            timezoneOffset: user.timezoneOffset,
            language: user.language
        }

        return payload as JwtPayload;
    }
}