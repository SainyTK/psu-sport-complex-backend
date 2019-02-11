import { Court } from './model/court.model';

export const CourtProviders = [
    {
        provide: 'courtRepo',
        useValue: Court,
    },
];
