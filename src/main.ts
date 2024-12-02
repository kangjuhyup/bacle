import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { ResponseInterceptor } from '@middleware/interceptor/response.interceptor';
import { AppModule } from './app.module';
import { Logger } from 'nestjs-pino';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { bufferLogs: true });
  app.useLogger(app.get(Logger));
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      transformOptions: {
        enableImplicitConversion: true,
      },
    }),
  );
  app.useGlobalInterceptors(new ResponseInterceptor());
  app.enableCors({
    origin: 'https://bacl.gg',
  });
  await app.listen(4000);
}
bootstrap();
