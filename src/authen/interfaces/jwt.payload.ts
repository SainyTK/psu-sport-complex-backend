import { User } from '../../user/model/user.model';

export class JwtPayload {
    userId: number;
    fname: string;
    lname: string;
    phoneNumber: string;
    dob: Date;
    gender: 'M' | 'F';
    timezoneOffset: number;
    language: string;
    position: string;

    public static fromModel(user) {
        const payload = {
            userId: user.userId,
            fname: user.fname,
            lname: user.lname,
            phoneNumber: user.phoneNumber,
            dob: user.dob,
            gender: user.gender,
            timezoneOffset: user.timezoneOffset,
            language: user.language,
            position: user.position
        }

        return payload as JwtPayload;
    }
}