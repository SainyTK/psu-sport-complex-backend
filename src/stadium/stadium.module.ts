import { Module } from '@nestjs/common';
import { StadiumController } from './stadium.controller';
import { StadiumService } from './stadium.service';
import { StadiumProviders } from './stadium.provider';
import { DatabaseModule } from '../database/database.module';
import { PassportModule } from '@nestjs/passport';

@Module({
  imports: [
    PassportModule.register({ defaultStrategy: 'jwt'}),
    DatabaseModule
  ],
  exports: [StadiumService],
  controllers: [StadiumController],
  providers: [StadiumService, ...StadiumProviders],
})
export class StadiumModule {}
