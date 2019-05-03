import { Module, MulterModule } from '@nestjs/common';
import { BillService } from './bill.service';
import { BillController } from './bill.controller';
import { BillProviders } from './bill.provider';
import { DatabaseModule } from '../database/database.module';
import { TransactionModule } from '../transaction/transaction.module';

@Module({
  imports: [
    DatabaseModule,
    TransactionModule
  ],
  exports: [BillService],
  controllers: [BillController],
  providers: [BillService, ...BillProviders],
})
export class BillModule { }
