import { Module } from '@nestjs/common';
import { InitController } from './init.controller';
import { InitService } from './init.service';
import { StadiumModule } from '../stadium/stadium.module';
import { AuthModule } from '../authen/auth.module';

@Module({
  imports: [
    StadiumModule,
    AuthModule
  ],
  controllers: [InitController],
  providers: [InitService],
})
export class InitModule {}
