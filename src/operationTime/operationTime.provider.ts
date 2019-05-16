import { Blackout } from './model/blackout.model';

export const OperationTimeProviders = [
    {
        provide: 'blackoutRepo',
        useValue: Blackout,
    },
];
