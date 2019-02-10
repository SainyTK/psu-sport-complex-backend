import { Stadium } from './model/stadium.model';

export const StadiumProviders = [
    {
        provide: 'stadiumRepo',
        useValue: Stadium,
    },
];
