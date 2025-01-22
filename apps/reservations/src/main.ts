import { NestFactory } from '@nestjs/core';
import { ReservationsModule } from './reservations.module';
import { ValidationPipe } from '@nestjs/common';
import { Logger } from 'nestjs-pino';
import { ConfigService } from '@nestjs/config';
import { log } from 'console';

async function bootstrap() {
  const app = await NestFactory.create(ReservationsModule);

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      // transform: true,
    }),
  );
  app.useLogger(app.get(Logger)); // จะเห็นแต่ละเส้นที่เรียกใช้ logger ในการ log ข้อมูล [14:10:03.617] INFO (12535): request completed {"req":{"id":5,"method":"POST","url":"/users","query":{},"params":{"0":"users"},"headers":{"content-type":"application/json","user-agent":"PostmanRuntime/7.43.0","accept":"*/*","postman-token":"f7c9a6da-7322-4c07-885a-bae5b8c93b16","host":"localhost:3001","accept-encoding":"gzip, deflate, br","connection":"keep-alive","content-length":"54"},"remoteAddress":"::1","remotePort":63440},"res":{"statusCode":400,"headers":{"x-powered-by":"Express","content-type":"application/json; charset=utf-8","content-length":"109","etag":"W/\"6d-x7t5MKJ2wly5lIB1hSLeMUCaIzU\""}},"responseTime":2}
  // จะเห็นว่ามีการ log ข้อมูลของ request และ response ที่เข้ามาและออกไป

  const configService = app.get(ConfigService);
  const port = configService.get<number>('PORT') ?? 3000;
  log(`PORT: ${port}`);
  await app.listen(port);
  // await app.listen(process.env.port ?? 3000);
}
bootstrap();
