import { RefreshToken } from 'src/entity/RefreshToken';
import { User } from 'src/user/entities/user.entity';
import { DataSource } from 'typeorm';

export const databaseProviders = [
  {
    provide: 'DATA_SOURCE',
    useFactory: async () => {
      const dataSource = new DataSource({
        type: 'mysql',
        host: 'localhost',
        port: 3306,
        username: 'root',
        password: process.env.DB_PASSWORD,
        database: process.env.DB_DATABASE,
        // entities: [__dirname + '/../**/*.entity{.ts,.js}'],
        entities: [User, RefreshToken],
        synchronize: true,
      });

      return dataSource.initialize();
    },
  },
];
