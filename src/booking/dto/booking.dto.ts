import { IsInt, IsDateString, IsString } from 'class-validator';
import { Booking } from '../model/booking.model';

export class BookingDTO {
    @IsString() readonly title: string;

    @IsString() readonly description: string;

    @IsInt() readonly userId: number;

    @IsInt() readonly stadiumId: number;

    @IsInt() readonly courtId: number;

    @IsDateString() readonly startDate: Date;

    @IsDateString() readonly endDate: Date;

    public static toModel(dto: BookingDTO) {
        let model = {
            title: dto.title,
            description: dto.description,
            userId: dto.userId,
            stadiumId: dto.stadiumId,
            courtId: dto.courtId,
            startDate: dto.startDate,
            endDate: dto.endDate,
        } as Booking;
        return model;
    }
}