import { Module } from '@nestjs/common';
import { LoggerModule as Logger } from 'nestjs-pino';

@Module({
  imports: [
    Logger.forRoot({
      pinoHttp: {
        transport: {
          target: 'pino-pretty',
          options: {
            singleLine: true,
          },
        },
      },
    }),
  ],
  providers: [],
  exports: [],
})
export class LoggerModule {}
