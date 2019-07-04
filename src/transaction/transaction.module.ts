import { Module } from '@nestjs/common';
import { TransactionController } from './transaction.controller';
import { TransactionService } from './transaction.service';
import { TransactionProviders } from './transaction.provider';
import { DatabaseModule } from '../database/database.module';
import { TransactionGateway } from './transaction.gateway';

@Module({
  imports: [
    DatabaseModule
  ],
  exports: [TransactionService],
  controllers: [TransactionController],
  providers: [TransactionService, ...TransactionProviders, TransactionGateway],
})
export class TransactionModule {}
