import { Sequelize } from 'sequelize-typescript';
import { dbConfig } from '../config/db.config';

import { User } from '../user/model/user.model';
import { Stadium } from '../stadium/model/stadium.model';
import { Booking } from '../booking/model/booking.model';
import { Bill } from '../bill/model/bill.model';

export const DatabaseProviders = [
    {
        provide: 'db',
        useFactory: async () => {
            const sequelize = new Sequelize({
                dialect: 'mysql',
                host: dbConfig.host,
                port: 3306,
                username: dbConfig.username,
                password: dbConfig.password,
                database: dbConfig.database,
            });
            sequelize.addModels([
                User,
                Stadium,
                Booking,
                Bill
            ]);
            await sequelize.sync();
            return sequelize;
        },
    },
];
