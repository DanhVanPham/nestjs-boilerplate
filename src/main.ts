import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { ConfigService } from '@nestjs/config';
import { AppModule } from './app.module';

async function bootstrap() {
  const logger = new Logger(bootstrap.name);
  const app = await NestFactory.create(AppModule);
  const config_service = app.get(ConfigService);
  const portServer = config_service.get('PORT') || 3000;
  console.log(config_service.get('DATABASE_URI'));
  await app.listen(portServer, () => {
    logger.log(`Application is running on port: ${portServer}`);
  });
}
bootstrap();
