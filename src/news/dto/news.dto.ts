import { News } from '../model/news.model';
import { IsString } from 'class-validator';

export class NewsDTO {
    @IsString() title: string;
    @IsString() featuredImageUrl: string;
    @IsString() content: string;

    static toModel(dto: NewsDTO): News {
        const model = {
            title: dto.title,
            featureImageUrl: dto.featuredImageUrl,
            content: dto.content
        } as News;

        return model;
    }
}