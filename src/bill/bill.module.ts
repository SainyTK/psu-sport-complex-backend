import { Module } from '@nestjs/common';
import { BillService } from './bill.service';
import { BillController } from './bill.controller';
import { BillProviders } from './bill.provider';
import { DatabaseModule } from '../database/database.module';
import { BillGateway } from './bill.gateway';

@Module({
  imports: [
    DatabaseModule,
  ],
  exports: [BillService],
  controllers: [BillController],
  providers: [BillService, BillGateway, ...BillProviders],
})
export class BillModule { }
