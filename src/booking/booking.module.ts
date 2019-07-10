import { Module, Global } from '@nestjs/common';
import { BookingController } from './booking.controller';
import { BookingService } from './booking.service';
import { BookingProviders } from './booking.provider';
import { DatabaseModule } from '../database/database.module';
import { PassportModule } from '@nestjs/passport';
import { StadiumModule } from '../stadium/stadium.module';
import { BillModule } from '../bill/bill.module';
import { OperationTimeModule } from '../operationTime/operationTime.module';
import { UserModule } from '../user/user.module';
import { BookingGateway } from './booking.gateway';

@Global()
@Module({
  imports: [
    PassportModule.register({ defaultStrategy: 'jwt' }),
    DatabaseModule,
    StadiumModule,
    BillModule,
    OperationTimeModule,
    UserModule
  ],
  exports: [BookingService],
  controllers: [BookingController],
  providers: [BookingGateway, BookingService, ...BookingProviders],
})
export class BookingModule { }
