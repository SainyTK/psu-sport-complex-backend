import { IsString } from 'class-validator';

export class CreateStadiumDTO {
    @IsString() readonly stadiumName: string;
}