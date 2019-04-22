import { Module, MulterModule } from '@nestjs/common';
import { BillService } from './bill.service';
import { BillController } from './bill.controller';
import { BillProviders } from './bill.provider';
import { DatabaseModule } from '../database/database.module';
import MulterConfigService from '../config/multerconfig.service';

@Module({
  imports: [
    DatabaseModule,
    MulterModule.registerAsync({
      useClass: MulterConfigService
    }),
  ],
  exports: [BillService],
  controllers: [BillController],
  providers: [BillService, ...BillProviders],
})
export class BillModule { }
