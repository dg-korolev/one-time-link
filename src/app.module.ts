import { Module } from '@nestjs/common';
import { OneTimeLinkModule } from './modules/oneTimeLink/oneTimeLink.module';
import { ConfigModule } from '@nestjs/config';
import { join } from 'path';
import { loadConfiguration } from './config/configuration';

const envFilePath: string = join(
  __dirname,
  `../${process.env.NODE_ENV ?? 'development'}.env`,
);

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath,
      load: [loadConfiguration],
      isGlobal: true,
    }),
    OneTimeLinkModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
