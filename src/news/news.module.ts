import { Module } from '@nestjs/common';
import { NewsService } from './news.service';
import { NewsController } from './news.controller';
import { NewsProviders } from './news.provider';
import { DatabaseModule } from '../database/database.module';

@Module({
  imports: [
    DatabaseModule
  ],
  exports: [NewsService],
  controllers: [NewsController],
  providers: [NewsService, ...NewsProviders],
})
export class NewsModule { }
