import { Logger, ValidationPipe } from '@nestjs/common';
import { NestExpressApplication } from '@nestjs/platform-express';
import { NestFactory } from '@nestjs/core';
import { ConfigService } from '@nestjs/config';
import { AppModule } from './app.module';
import { cofigSwagger } from '@configs/api-docs.config';
import { join } from 'path';

async function bootstrap() {
  const logger = new Logger(bootstrap.name);
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  // Config swagger
  cofigSwagger(app);
  app.useStaticAssets(join(__dirname, './served'));
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
    }),
  );
  const config_service = app.get(ConfigService);
  const portServer = config_service.get('PORT') || 3000;
  console.log(config_service.get('DATABASE_URI'));
  await app.listen(portServer, () => {
    logger.log(`Application is running on port: ${portServer}`);
  });
}
bootstrap();
