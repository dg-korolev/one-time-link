import { NestFactory } from '@nestjs/core';
import {
  FastifyAdapter,
  NestFastifyApplication,
} from '@nestjs/platform-fastify';
import { Logger } from '@nestjs/common';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { AppConfig, ServerConfig } from './config/configuration';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

const BODY_MAX_SIZE_LIMIT = 10 * 1024 * 1024;

async function bootstrap() {
  const logger = new Logger();

  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    new FastifyAdapter({ bodyLimit: BODY_MAX_SIZE_LIMIT }),
  );

  const globalPrefix = 'api';
  app.setGlobalPrefix(globalPrefix);

  app.enableCors();

  const appConfig: ServerConfig = app
    .get(ConfigService<AppConfig>)
    .get('server');

  const options = new DocumentBuilder()
    .setTitle('OneTimeLink App')
    .setDescription('OneTimeLink API')
    .addTag('CommonNode')
    .setVersion('0.0.1')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, options);
  SwaggerModule.setup('doc', app, document);

  await app.listen(appConfig.port, appConfig.host);
  logger.log(
    `🚀 Application is running on: http://${appConfig.host}:${appConfig.port}/${globalPrefix}`,
  );
}
bootstrap();
