import { Injectable, Inject } from '@nestjs/common';
import { News } from './model/news.model';

@Injectable()
export class NewsService {
    constructor(
        @Inject('newsRepo') private readonly news: typeof News,
    ) { }

    async getNews(off, lim) {
        const offset = parseInt(off) || 0;
        const limit = parseInt(lim) || 20;
        return await this.news.findAll({
            offset,
            limit
        });
    }

    async createNews(data: News) {
        return await this.news.create(data);
    }

    async updateNews(id: number, data: News) {
        const news = await this.news.findById(id);
        if (!news)
            return { error: 'news not found'};
        return await news.update(data);
    }

    async deleteNews(id: number) {
        const news = await this.news.findById(id);
        if (!news)
            return { error: 'news not found'};
        await news.destroy();
        return 'delete successful';
    }

    
}
