import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { DataSource, DataSourceOptions } from 'typeorm';
// accounts
import { Entities } from './accounts/entities';

export const getTypeOrmModuleForRoot = () =>
  TypeOrmModule.forRootAsync({
    imports: [ConfigModule],
    inject: [ConfigService],
    // to configure the DataSourceOptions.
    useFactory: (configService: ConfigService): DataSourceOptions => ({
      type: 'mysql',
      host: configService.get('DB_HOST'),
      port: +configService.get('DB_PORT'),
      username: configService.get('DB_USERNAME'),
      password: configService.get('DB_PASSWORD'),
      database: configService.get('DB_DATABASE'),
      entities: [...Entities],
      timezone: 'Z',
      synchronize: true,
    }),
    // dataSource receives the configured DataSourceOptions
    // and returns a Promise<DataSource>.
    dataSourceFactory: async (options: DataSourceOptions): Promise<DataSource> => {
      const dataSource = await new DataSource(options).initialize();
      return dataSource;
    },
  });
