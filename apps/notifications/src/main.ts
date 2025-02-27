import { NestFactory } from '@nestjs/core';
import { NotificationsModule } from './notifications.module';
import { ConfigService } from '@nestjs/config';
import { Transport } from '@nestjs/microservices';
import { Logger } from 'nestjs-pino';

async function bootstrap() {
  const app = await NestFactory.create(NotificationsModule);
  const configService = app.get(ConfigService);
  app.connectMicroservice({
    transport: Transport.RMQ,
    options: {
      urls: [configService.getOrThrow<string>('RABBITMQ_URI')],
      queue: 'notifications',
      queueOptions: {
        durable: true, // ถ้า durable เป็น true จะทำให้ queue ที่สร้างขึ้นมีความทนทาน ถ้า RabbitMQ ปิดแล้วเปิดขึ้นมาอีกครั้ง ข้อมูลใน queue จะยังอยู่
      },
      noAck: false, // ถ้า noAck เป็น false message ที่ส่งไปยัง service จะต้องรอการยืนยันจาก service ก่อนที่จะถือว่า message ถูกส่งไปถึง service แล้ว
      // ถ้า noAck เป็น true message ที่ส่งไปยัง service จะถือว่า message ถูกส่งไปถึง service แล้วทันที โดยไม่ต้องรอการยืนยันจาก service
    },
  });

  app.useLogger(app.get(Logger));

  await app.startAllMicroservices();
}
bootstrap();
