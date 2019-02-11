import { Booking } from './model/booking.model';

export const BookingProviders = [
    {
        provide: 'bookingRepo',
        useValue: Booking,
    },
];
