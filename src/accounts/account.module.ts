import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { JWTStrategy } from '../shared/strategies/jwt.strategy';
import { Entities } from './entities';
import { AccountsController } from './account.controller';
import { AccountsService } from './account.service';

@Module({
  imports: [TypeOrmModule.forFeature(Entities), PassportModule, JwtModule.register({})],
  controllers: [AccountsController],
  providers: [AccountsService, JWTStrategy],
  exports: [AccountsService],
})
export class AccountsModule {}
