import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

import 'dotenv/config';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

const port = process.env.PORT;

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  /* set all resource with prefix: api */
  app.setGlobalPrefix('api');
  const options = new DocumentBuilder().build();
  const document = SwaggerModule.createDocument(app, options);
  SwaggerModule.setup('api', app, document);
  await app.listen(port);
}
bootstrap();
