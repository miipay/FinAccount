import { APP_FILTER, APP_PIPE } from '@nestjs/core';
import { Module, ValidationPipe } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
// shared
import { InternalServerErrorFilter } from './shared/filters/internalServerError.filter';
import { AllExceptionsFilter } from './shared/filters/allException.filter';
import { EntityNotFoundExceptionFilter } from './shared/filters/entityNotFound.filter';
import { getTypeOrmModuleForRoot } from './app.typeorm';
// accounts
import { AccountsModule } from './accounts/account.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: ['.env', '.env.dev'],
      isGlobal: true,
    }),
    getTypeOrmModuleForRoot(),
    AccountsModule,
  ],
  providers: [
    {
      provide: APP_FILTER,
      useClass: AllExceptionsFilter,
    },
    {
      provide: APP_FILTER,
      useClass: InternalServerErrorFilter,
    },
    {
      provide: APP_FILTER,
      useClass: EntityNotFoundExceptionFilter,
    },
    {
      provide: APP_PIPE,
      useValue: new ValidationPipe({
        transform: true,
        whitelist: true,
      }),
    },
  ],
})
export class AppModule {}
