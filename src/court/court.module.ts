import { Module } from '@nestjs/common';
import { CourtController } from './court.controller';
import { CourtService } from './court.service';
import { CourtProviders } from './court.provider';
import { DatabaseModule } from '../database/database.module';
import { PassportModule } from '@nestjs/passport';

@Module({
  imports: [
    PassportModule.register({ defaultStrategy: 'jwt'}),
    DatabaseModule
  ],
  exports: [CourtService],
  controllers: [CourtController],
  providers: [CourtService, ...CourtProviders],
})
export class CourtModule {}
