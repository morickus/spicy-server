import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import * as cookieParser from 'cookie-parser';
import * as cors from 'cors';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const config = new DocumentBuilder().setTitle('Spicy').build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  app.use(cookieParser());
  app.useGlobalPipes(new ValidationPipe());

  const corsDomain = process.env.CORS_DOMAINS || 'http://localhost';
  const corsRegex = new RegExp(`^${corsDomain.replace('.', '\\.')}(:\\d+)?$`);
  app.use(
    cors({
      origin: corsRegex,
      credentials: true,
    }),
  );

  await app.listen(8000);
}
bootstrap();
