export class JwtPayload {
    userId: number;
    fname: string;
    lname: string;
    phoneNumber: string;
    emai: string;
    psuPassport: string;
    dob: Date;
    gender: 'M' | 'F';
    position: string;
    refreshToken: string;

    public static fromModel(user) {
        const payload = {
            userId: user.userId,
            fname: user.fname,
            lname: user.lname,
            phoneNumber: user.phoneNumber,
            emai: user.email,
            psuPassport: user.psuPassport,
            dob: user.dob,
            gender: user.gender,
            position: user.position,
            refreshToken: user.refreshToken
        }

        return payload as JwtPayload;
    }
}