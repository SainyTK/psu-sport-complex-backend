import { Module } from '@nestjs/common';
import { BookingController } from './booking.controller';
import { BookingService } from './booking.service';
import { BookingProviders } from './booking.provider';
import { DatabaseModule } from '../database/database.module';
import { PassportModule } from '@nestjs/passport';

@Module({
  imports: [
    PassportModule.register({ defaultStrategy: 'jwt'}),
    DatabaseModule
  ],
  exports: [BookingService],
  controllers: [BookingController],
  providers: [BookingService, ...BookingProviders],
})
export class BookingModule {}
