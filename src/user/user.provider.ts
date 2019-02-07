import { User } from './model/user.model';

export const UserProviders = [
    {
        provide: 'userRepo',
        useValue: User,
    },
];
