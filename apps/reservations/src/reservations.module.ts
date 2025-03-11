import { Module } from '@nestjs/common';
import { ReservationsService } from './reservations.service';
import { ReservationsController } from './reservations.controller';
import { LoggerModule } from '@app/common/logger/logger.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import * as Joi from 'joi';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { AUTH_SERVICE, PAYMENTS_SERVICE } from '@app/common/constants/services';
import { HealthModule } from '@app/common';
import { PrismaService } from './prisma.service';

@Module({
  imports: [
    LoggerModule,
    ConfigModule.forRoot({
      isGlobal: true,
      validationSchema: Joi.object({
        // MONGODB_URI: Joi.string().required(),
        DATABASE_URL: Joi.string().required(),

        HTTP_PORT: Joi.number().required(),
        // HTTP_PORT: Joi.number().default(3000),
        AUTH_PORT: Joi.number().required(),
        AUTH_HOST: Joi.string().required(),

        PAYMENTS_PORT: Joi.number().required(),
        PAYMENTS_HOST: Joi.string().required(),
      }),
    }),
    ClientsModule.registerAsync([
      {
        inject: [ConfigService],
        name: AUTH_SERVICE,
        useFactory: (configService: ConfigService) => ({
          transport: Transport.TCP,
          options: {
            host: configService.get<string>('AUTH_HOST'),
            port: configService.get<number>('AUTH_PORT'),
          },
        }),
      },
      {
        inject: [ConfigService],
        name: PAYMENTS_SERVICE,
        useFactory: (configService: ConfigService) => ({
          transport: Transport.TCP,
          options: {
            host: configService.get<string>('PAYMENTS_HOST'),
            port: configService.get<number>('PAYMENTS_PORT'),
          },
        }),
      },
    ]),
    HealthModule,
  ],
  controllers: [ReservationsController],
  providers: [ReservationsService, PrismaService],
})
export class ReservationsModule {}
