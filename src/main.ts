import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as bodyParser from 'body-parser';
import cors from 'cors';

const PORT = process.env.PORT || 3001;

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  //cors
  app.use(cors());

  app.setGlobalPrefix('api');

  app.use(bodyParser.json({ limit: '50MB' }));

  await app.listen(PORT);
}

bootstrap();