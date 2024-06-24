import {
  Module,
  OnApplicationBootstrap,
  OnApplicationShutdown,
} from '@nestjs/common';
import { InjectConnection, SequelizeModule } from '@nestjs/sequelize';
import { ConfigService } from '@nestjs/config';
import { DatabaseError, QueryTypes, Sequelize } from 'sequelize';
import { OneTimeLinkModel, OneTimeLinkRepository } from './repositories';
import { AppConfig, DbConfig } from '../../config/configuration';

const modelsArray = [OneTimeLinkModel];
const repositoriesArray = [OneTimeLinkRepository];

@Module({
  imports: [
    SequelizeModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService<AppConfig>) => {
        const dbConfig: DbConfig = configService.get('dbConfig');
        const appName: string = configService.get('appName');

        return {
          uri: dbConfig.uri,
          logging: dbConfig.logging,
          dialect: 'postgres',
          dialectOptions: {
            timezone: 'UTC',
            application_name: appName,
            statement_timeout: 120_000,
            query_timeout: 120_000,
            idle_in_transaction_session_timeout: 120_000,
          },
          pool: {
            max: 8,
            min: 8,
            acquire: 120000,
            idle: 120000,
          },
          autoLoadModels: false,
          synchronize: false,
          repositoryMode: false,
          models: modelsArray,
        };
      },
    }),
    SequelizeModule.forFeature(modelsArray),
  ],
  providers: [...repositoriesArray],
  exports: [...repositoriesArray],
})
export class DatabaseModule
  implements OnApplicationBootstrap, OnApplicationShutdown
{
  constructor(@InjectConnection() private readonly sequelize: Sequelize) {}

  async onApplicationBootstrap(): Promise<void> {
    const checkSql = `SELECT 1 = 1; -- [${DatabaseModule.name}] bootstrap check`;
    try {
      await this.sequelize.query(checkSql, { type: QueryTypes.SELECT });
    } catch (err) {
      throw new DatabaseError({
        name: 'CANNOTCHECK',
        message: `[${DatabaseModule.name}] Filed on application bootstrap check. Error: '${err.message}'.`,
        sql: checkSql,
      });
    }
  }

  onApplicationShutdown(signal?: string): any {
    /*
    @nestjs/common  make graceful shutdown
     */
  }
}
