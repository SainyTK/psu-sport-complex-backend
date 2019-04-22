import { Module } from '@nestjs/common';
import { UserModule } from './user/user.module';
import { AuthModule } from './authen/auth.module';
import { StadiumModule } from './stadium/stadium.module';
import { BookingModule } from './booking/booking.module';
import { BillModule } from './bill/bill.module';
import { InitModule } from './init/init.module';

@Module({
  imports: [
    InitModule,
    UserModule,
    AuthModule,
    StadiumModule,
    BookingModule,
    BillModule
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
