import { Stadium } from '../model/stadium.model';
import { IsDateString, IsString, IsInt, IsBoolean } from 'class-validator';

export class StadiumDTO {
    @IsString() name: string;
    @IsInt() numCourt: number;
    @IsInt() costPublic: number;
    @IsInt() costMember: number;
    @IsInt() costStudent: number;
    @IsInt() costStaff: number;
    @IsString() openAfter: string;
    @IsString() closeBefore: string;
    @IsBoolean() canBook: boolean;

    static toModel(dto: StadiumDTO): Stadium {
        const model = {
            name: dto.name,
            numCourt: dto.numCourt,
            costPublic: dto.costPublic,
            costMember: dto.costMember,
            costStudent: dto.costStudent,
            costStaff: dto.costStaff,
            openAfter: dto.openAfter,
            closeBefore: dto.closeBefore,
            canBook: dto.canBook
        } as Stadium;

        return model;
    }
}