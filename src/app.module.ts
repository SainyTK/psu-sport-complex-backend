import { Module } from '@nestjs/common';
import { UserModule } from './user/user.module';
import { AuthModule } from './authen/auth.module';
import { StadiumModule } from './stadium/stadium.module';
import { BookingModule } from './booking/booking.module';
import { BillModule } from './bill/bill.module';
import { InitModule } from './init/init.module';
import { OperationTimeModule } from './operationTime/operationTime.module';
import { NewsModule } from './news/news.module';


@Module({
  imports: [
    InitModule,
    UserModule,
    AuthModule,
    StadiumModule,
    BookingModule,
    BillModule,
    OperationTimeModule,
    NewsModule
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
