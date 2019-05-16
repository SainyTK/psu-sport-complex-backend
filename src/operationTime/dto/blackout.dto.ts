import { Blackout } from "../model/blackout.model";
import { IsDateString, IsString } from "class-validator";

export class BlackoutDTO {
    @IsDateString() start: Date;
    @IsDateString() end: Date;
    @IsString() title: string;
    @IsString() detail: string;

    static toModel(dto: BlackoutDTO): Blackout {
        const model = {
            start: dto.start,
            end: dto.end,
            title: dto.title,
            detail: dto.detail
        } as Blackout;

        return model;
    }
}