import { IsNumber, IsDateString } from 'class-validator';

export class MemberDTO {
    @IsDateString() startDate: string;
    @IsDateString() endDate: string;
    @IsNumber() amount: number;
}