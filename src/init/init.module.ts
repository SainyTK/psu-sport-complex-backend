import { Module } from '@nestjs/common';
import { InitController } from './init.controller';
import { InitService } from './init.service';
import { StadiumModule } from '../stadium/stadium.module';
import { CourtModule } from '../court/court.module';

@Module({
  imports: [
    StadiumModule,
    CourtModule
  ],
  controllers: [InitController],
  providers: [InitService],
})
export class InitModule {}
