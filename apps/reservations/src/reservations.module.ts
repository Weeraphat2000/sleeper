import { Module } from '@nestjs/common';
import { ReservationsService } from './reservations.service';
import { ReservationsController } from './reservations.controller';
import { ReservationsRepository } from './reservations.repository';
import { DatabaseModule } from '@app/common/database';
import { Reservation } from './models/reservation.entity';
import { LoggerModule } from '@app/common/logger/logger.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import * as Joi from 'joi';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { AUTH_SERVICE, PAYMENTS_SERVICE } from '@app/common/constants/services';
import { HealthModule } from '@app/common';

@Module({
  imports: [
    DatabaseModule,
    DatabaseModule.forFeature([Reservation]),
    LoggerModule,
    ConfigModule.forRoot({
      isGlobal: true,
      validationSchema: Joi.object({
        HTTP_PORT: Joi.number().required(),
        // HTTP_PORT: Joi.number().default(3000),
        AUTH_PORT: Joi.number().required(),
        AUTH_HOST: Joi.string().required(),

        PAYMENTS_PORT: Joi.number().required(),
        PAYMENTS_HOST: Joi.string().required(),
      }),
    }),
    // *****
    // สร้าง client สำหรับเรียกใช้งาน service อื่นๆ โดยใช้ ClientsModule.registerAsync()
    ClientsModule.registerAsync([
      {
        inject: [ConfigService],
        name: AUTH_SERVICE,
        useFactory: (configService: ConfigService) => ({
          transport: Transport.RMQ,
          options: {
            urls: [configService.getOrThrow<string>('RABBITMQ_URI')],
            queue: 'auth',
            queueOptions: {
              durable: true, // ถ้า durable เป็น true จะทำให้ queue ที่สร้างขึ้นมีความทนทาน ถ้า RabbitMQ ปิดแล้วเปิดขึ้นมาอีกครั้ง ข้อมูลใน queue จะยังอยู่
            },
          },
        }),
      },
      {
        inject: [ConfigService],
        name: PAYMENTS_SERVICE, // ชื่อ service ที่เราตั้งเอง
        useFactory: (configService: ConfigService) => ({
          transport: Transport.RMQ,
          options: {
            urls: [configService.getOrThrow<string>('RABBITMQ_URI')],
            queue: 'payments',
            queueOptions: {
              durable: true, // ถ้า durable เป็น true จะทำให้ queue ที่สร้างขึ้นมีความทนทาน ถ้า RabbitMQ ปิดแล้วเปิดขึ้นมาอีกครั้ง ข้อมูลใน queue จะยังอยู่
            },
          },
        }),
      },
    ]),
    HealthModule,
  ],
  controllers: [ReservationsController],
  providers: [ReservationsService, ReservationsRepository],
})
export class ReservationsModule {}
