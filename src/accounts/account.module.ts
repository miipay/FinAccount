import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Entities } from './entities';
import { AccountsController } from './account.controller';
import { AccountsService } from './account.service';

@Module({
  imports: [TypeOrmModule.forFeature(Entities)],
  controllers: [AccountsController],
  providers: [AccountsService],
  exports: [AccountsService],
})
export class AccountsModule {}
