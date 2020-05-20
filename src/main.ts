import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

import 'dotenv/config';

const port = process.env.PORT;

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  /* set all resource with prefix: api */
  app.setGlobalPrefix('api');
  await app.listen(port);
}
bootstrap();
