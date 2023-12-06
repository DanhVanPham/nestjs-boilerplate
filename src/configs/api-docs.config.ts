import { INestApplication } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

export function cofigSwagger(app: INestApplication) {
  const config = new DocumentBuilder()
    .setTitle('Flash Card Project')
    .setDescription('## The flash card api description')
    .setVersion('1.0')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api-docs', app, document);
}
