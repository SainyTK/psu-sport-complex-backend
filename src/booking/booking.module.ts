import { Module, MulterModule } from '@nestjs/common';
import { BookingController } from './booking.controller';
import { BookingService } from './booking.service';
import { BookingProviders } from './booking.provider';
import { DatabaseModule } from '../database/database.module';
import { PassportModule } from '@nestjs/passport';
import MulterConfigService from 'src/config/multerconfig.service';

@Module({
  imports: [
    PassportModule.register({ defaultStrategy: 'jwt' }),
    MulterModule.registerAsync({
      useClass: MulterConfigService
    }),
    DatabaseModule
  ],
  exports: [BookingService],
  controllers: [BookingController],
  providers: [BookingService, ...BookingProviders],
})
export class BookingModule { }
