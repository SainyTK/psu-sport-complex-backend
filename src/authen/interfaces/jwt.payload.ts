export class JwtPayload {
    userId: number;
    fname: string;
    lname: string;
    phoneNumber: string;
    email: string;
    psuPassport: string;
    dob: Date;
    gender: 'M' | 'F';
    position: string;
    refreshToken: string;
    memberEnd: Date;

    public static fromModel(user) {
        const payload = {
            userId: user.userId,
            fname: user.fname,
            lname: user.lname,
            phoneNumber: user.phoneNumber,
            email: user.email,
            psuPassport: user.psuPassport,
            dob: user.dob,
            gender: user.gender,
            position: user.position,
            refreshToken: user.refreshToken,
            memberEnd: user.memberEnd
        }

        return payload as JwtPayload;
    }
}