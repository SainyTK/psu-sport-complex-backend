import { Module, Global } from '@nestjs/common';
import { MulterModule } from '@nestjs/platform-express';
import { BookingController } from './booking.controller';
import { BookingService } from './booking.service';
import { BookingProviders } from './booking.provider';
import { DatabaseModule } from '../database/database.module';
import { PassportModule } from '@nestjs/passport';
import MulterConfigService from '../config/multerconfig.service';
import { StadiumModule } from '../stadium/stadium.module';
import { BillModule } from '../bill/bill.module';
import { OperationTimeModule } from '../operationTime/operationTime.module';
import { UserModule } from '../user/user.module';
import { BookingGateway } from './booking.gateway';

@Global()
@Module({
  imports: [
    PassportModule.register({ defaultStrategy: 'jwt' }),
    MulterModule.registerAsync({
      useClass: MulterConfigService
    }),
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
