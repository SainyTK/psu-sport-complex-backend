import { Module, forwardRef } from '@nestjs/common';
import { MulterModule } from '@nestjs/platform-express';
import { BillService } from './bill.service';
import { BillController } from './bill.controller';
import { BillProviders } from './bill.provider';
import { DatabaseModule } from '../database/database.module';
import { TransactionModule } from '../transaction/transaction.module';

@Module({
  imports: [
    DatabaseModule,
  ],
  exports: [BillService],
  controllers: [BillController],
  providers: [BillService, ...BillProviders],
})
export class BillModule { }
