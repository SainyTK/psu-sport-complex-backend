import { Module, Global } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { UserProviders } from './user.provider';
import { DatabaseModule } from '../database/database.module';
import { PassportModule } from '@nestjs/passport';
import { TransactionModule } from '../transaction/transaction.module';

@Module({
  imports: [
    PassportModule.register({ defaultStrategy: 'jwt'}),
    DatabaseModule,
    TransactionModule
  ],
  exports: [UserService],
  controllers: [UserController],
  providers: [UserService, ...UserProviders],
})
export class UserModule {}
