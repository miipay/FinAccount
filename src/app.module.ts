import { APP_FILTER, APP_PIPE } from '@nestjs/core';
import { Module, NestModule, MiddlewareConsumer, ValidationPipe } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
// shared
import { LoggerMiddleware } from './shared/middlewares/logger.middleware';
import { InternalServerErrorFilter } from './shared/filters/internal-server-error.filter';
import { AllExceptionsFilter } from './shared/filters/all-exception.filter';
import { EntityNotFoundExceptionFilter } from './shared/filters/entity-not-found.filter';
// accounts
import { AccountsModule } from './accounts/account.module';
import { Entities } from './accounts/entities';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mariadb',
      host: 'localhost',
      port: 3306,
      username: 'root',
      password: '1234567890',
      database: 'finaccount',
      entities: [...Entities],
      timezone: 'Z',
      synchronize: true,
    }),
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
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerMiddleware).forRoutes('/');
  }
}
