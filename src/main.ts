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


  // Settings for CORS
  // app.use(function (req, res, next) {

  //   // Website you wish to allow to connect
  //   res.header('Access-Control-Allow-Origin', 'http://localhost');

  //   // Request methods you wish to allow
  //   res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');

  //   // Request headers you wish to allow
  //   res.header('Access-Control-Allow-Headers', '*,X-Requested-With,content-type,Authorization');

  //   // Set to true if you need the website to include cookies in the requests sent
  //   // to the API (e.g. in case you use sessions)
  //   res.setHeader('Access-Control-Allow-Credentials', true);

  //   // Pass to next layer of middleware
  //   next();
  // });

  // app.enableCors({
  //   origin: [
  //     'http://localhost:4200', // angular
  //     'http://localhost:3000', // react
  //     'http://localhost:8081', // react-native
  //     'http://localhost:80',
  //     '*'
  //   ],
  //   allowedHeaders: ['*'],
  //   credentials: true,
  //   methods: 'GET,POST,PATCH,DELETE,PUT,OPTIONS',
  // });