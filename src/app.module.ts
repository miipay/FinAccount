import { APP_FILTER, APP_PIPE } from '@nestjs/core';
import { Module, NestModule, MiddlewareConsumer, ValidationPipe } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
// shared
import { LoggerMiddleware } from './shared/middlewares/logger.middleware';
import { InternalServerErrorFilter } from './shared/filters/internal-server-error.filter';
import { AllExceptionsFilter } from './shared/filters/all-exception.filter';
import { EntityNotFoundExceptionFilter } from './shared/filters/entity-not-found.filter';
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
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerMiddleware).forRoutes('/');
  }
}
