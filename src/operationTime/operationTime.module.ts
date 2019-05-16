import { Module } from '@nestjs/common';
import { OperationTimeService } from './operationTime.service';
import { OperationTimeController } from './operationTime.controller';
import { OperationTimeProviders } from './operationTime.provider';
import { DatabaseModule } from '../database/database.module';

@Module({
  imports: [
    DatabaseModule
  ],
  exports: [OperationTimeService],
  controllers: [OperationTimeController],
  providers: [OperationTimeService, ...OperationTimeProviders],
})
export class OperationTimeModule { }
