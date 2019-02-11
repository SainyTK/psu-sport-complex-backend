import { IsInt, IsDateString } from 'class-validator';

export class BookingDTO {
    @IsInt() readonly userId: number;

    @IsInt() readonly courtId: number;

    @IsDateString() readonly startTime: Date;

    @IsDateString() readonly finishTime: Date;
}