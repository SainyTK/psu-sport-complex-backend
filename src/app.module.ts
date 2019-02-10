import { Module } from '@nestjs/common';
import { UserModule } from './user/user.module';
import { AuthModule } from './authen/auth.module';
import { StadiumModule } from './stadium/stadium.module';

@Module({
  imports: [
    UserModule,
    AuthModule,
    StadiumModule
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
