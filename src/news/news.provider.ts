import { News } from './model/news.model';

export const NewsProviders = [
    {
        provide: 'newsRepo',
        useValue: News,
    },
];
