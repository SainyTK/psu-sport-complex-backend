export default class TimeUtils {
    public static zeroOclock(date: Date): Date {
        const d = date;
        d.setUTCHours(0);
        d.setUTCMinutes(0);
        d.setUTCSeconds(0);
        d.setUTCMilliseconds(0);
        return d;
    }

    public static nextXDate(date: Date, x: number): Date {
        const d = date;
        d.setDate(d.getDate() + x);
        return d;
    }
}