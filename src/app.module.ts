import { Module } from '@nestjs/common';
import { UserModule } from './user/user.module';
import { AuthModule } from './authen/auth.module';
import { StadiumModule } from './stadium/stadium.module';
import { CourtModule } from './court/court.module';
import { BookingModule } from './booking/booking.module';

@Module({
  imports: [
    UserModule,
    AuthModule,
    StadiumModule,
    CourtModule,
    BookingModule
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}