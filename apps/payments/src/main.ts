import { NestFactory } from '@nestjs/core';
import { PaymentsModule } from './payments.module';
import { Transport } from '@nestjs/microservices';
import { ConfigService } from '@nestjs/config';
import { Logger } from 'nestjs-pino';

async function bootstrap() {
  const app = await NestFactory.create(PaymentsModule);
  const configService = app.get(ConfigService);
  app.connectMicroservice({
    transport: Transport.RMQ,
    options: {
      urls: [configService.getOrThrow<string>('RABBITMQ_URI')],
      queue: 'payments',
      queueOptions: {
        durable: true,
      },
      noAck: false, // ถ้า noAck เป็น false message ที่ส่งไปยัง service จะต้องรอการยืนยันจาก service ก่อนที่จะถือว่า message ถูกส่งไปถึง service แล้ว
      // ถ้า noAck เป็น true message ที่ส่งไปยัง service จะถือว่า message ถูกส่งไปถึง service แล้วทันที โดยไม่ต้องรอการยืนยันจาก service
    },
  });
  app.useLogger(app.get(Logger));
  await app.startAllMicroservices();
}
bootstrap();
